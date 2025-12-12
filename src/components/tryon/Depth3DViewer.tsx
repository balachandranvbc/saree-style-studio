import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { DepthModelData, createDepthMesh } from '@/lib/depthEstimation';

interface DepthMeshProps {
  depthData: DepthModelData;
  displacementScale: number;
}

function DepthMesh({ depthData, displacementScale }: DepthMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  
  // Load the original image as texture
  const texture = useTexture(depthData.originalImage);
  
  useEffect(() => {
    if (!depthData.depthMap) return;

    const meshData = createDepthMesh(depthData.depthMap, displacementScale);
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(meshData.vertices, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(meshData.uvs, 2));
    geo.setIndex(new THREE.BufferAttribute(meshData.indices, 1));
    geo.computeVertexNormals();
    
    setGeometry(geo);
    
    return () => {
      geo.dispose();
    };
  }, [depthData.depthMap, displacementScale]);

  // Gentle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 2.5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

interface Depth3DViewerProps {
  depthData: DepthModelData;
  displacementScale?: number;
  className?: string;
}

export function Depth3DViewer({ 
  depthData, 
  displacementScale = 0.3,
  className = ''
}: Depth3DViewerProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        dpr={[1, 2]}
      >
        <CameraController />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} />
        <pointLight position={[0, 0, 3]} intensity={0.5} />
        
        <DepthMesh 
          depthData={depthData} 
          displacementScale={displacementScale} 
        />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={1.5}
          maxDistance={5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI * 3 / 4}
        />
      </Canvas>
    </div>
  );
}
