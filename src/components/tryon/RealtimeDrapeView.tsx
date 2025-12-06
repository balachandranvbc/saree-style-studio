import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { DrapingStyle, Measurements, PoseData } from '@/types/tryon';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface RealtimeDrapeViewProps {
  uploadedImage: string;
  sareeColor: string;
  drapingStyle: DrapingStyle;
  measurements?: Measurements;
  poseData?: PoseData;
  interactive?: boolean;
}

// Draping style configurations
const styleConfigs: Record<DrapingStyle, {
  pleats: number;
  palluSide: 'left' | 'right';
  wrapDirection: number;
  palluLength: number;
}> = {
  nivi: { pleats: 7, palluSide: 'left', wrapDirection: 1, palluLength: 0.8 },
  bengali: { pleats: 0, palluSide: 'right', wrapDirection: -1, palluLength: 1.0 },
  gujarati: { pleats: 5, palluSide: 'right', wrapDirection: 1, palluLength: 0.9 },
  maharashtrian: { pleats: 9, palluSide: 'left', wrapDirection: 1, palluLength: 0.5 },
  tamil: { pleats: 8, palluSide: 'right', wrapDirection: -1, palluLength: 0.7 },
  kerala: { pleats: 4, palluSide: 'left', wrapDirection: 1, palluLength: 0.6 },
};

// Image plane that shows the uploaded photo
function ImagePlane({ imageUrl }: { imageUrl: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
      if (tex.image) {
        setAspectRatio(tex.image.width / tex.image.height);
      }
    });
  }, [imageUrl]);

  if (!texture) return null;

  const height = 2;
  const width = height * aspectRatio;

  return (
    <mesh ref={meshRef} position={[0, 0, -0.5]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

// Realtime saree drape mesh
function SareeDrapeMesh({ 
  color, 
  drapingStyle, 
  offsetX,
  offsetY,
  scale,
  rotation,
  opacity,
  poseData
}: { 
  color: string;
  drapingStyle: DrapingStyle;
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
  opacity: number;
  poseData?: PoseData;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const config = styleConfigs[drapingStyle];
  
  // Create saree geometry
  const geometry = React.useMemo(() => {
    const segments = 32;
    const heightSegments = 24;
    const geo = new THREE.PlaneGeometry(1, 1.5, segments, heightSegments);
    
    const positions = geo.attributes.position;
    
    for (let i = 0; i <= heightSegments; i++) {
      for (let j = 0; j <= segments; j++) {
        const index = i * (segments + 1) + j;
        
        const u = j / segments;
        const v = i / heightSegments;
        
        let x = positions.getX(index);
        let y = positions.getY(index);
        let z = positions.getZ(index);
        
        // Add wave for fabric flow
        x += Math.sin(v * Math.PI * 2) * 0.02;
        z += Math.sin(u * Math.PI * 3 + v * 2) * 0.03;
        
        // Add pleats at bottom
        if (config.pleats > 0 && v > 0.6) {
          const pleatFactor = Math.sin(u * config.pleats * Math.PI * 2) * 0.02 * (v - 0.6);
          z += pleatFactor;
        }
        
        // Curve for body wrap
        const wrapCurve = Math.sin(u * Math.PI) * 0.1 * config.wrapDirection;
        z += wrapCurve;
        
        // Pallu drape
        if (v < 0.3) {
          const palluOffset = config.palluSide === 'left' ? -0.1 : 0.1;
          x += palluOffset * (1 - v / 0.3) * config.palluLength;
          z -= 0.05 * (1 - v / 0.3);
        }
        
        positions.setXYZ(index, x, y, z);
      }
    }
    
    geo.computeVertexNormals();
    return geo;
  }, [config]);

  // Animate subtle movement
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  const sareeColor = new THREE.Color(color);

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry}
      position={[offsetX, offsetY, 0.1]}
      scale={[scale, scale, scale]}
      rotation={[0, 0, rotation]}
    >
      <meshStandardMaterial
        color={sareeColor}
        side={THREE.DoubleSide}
        roughness={0.6}
        metalness={0.1}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

// Main scene
function DrapeScene({ 
  uploadedImage, 
  sareeColor, 
  drapingStyle,
  offsetX,
  offsetY,
  scale,
  rotation,
  opacity,
  poseData,
  interactive
}: RealtimeDrapeViewProps & {
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
  opacity: number;
}) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 2, 2]} intensity={0.5} />
      
      <ImagePlane imageUrl={uploadedImage} />
      
      <SareeDrapeMesh
        color={sareeColor}
        drapingStyle={drapingStyle}
        offsetX={offsetX}
        offsetY={offsetY}
        scale={scale}
        rotation={rotation}
        opacity={opacity}
        poseData={poseData}
      />
      
      {interactive && (
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={false}
          minDistance={1}
          maxDistance={5}
        />
      )}
    </>
  );
}

// Need to import React for useMemo in the component
import React from 'react';

export function RealtimeDrapeView({ 
  uploadedImage, 
  sareeColor, 
  drapingStyle, 
  measurements,
  poseData,
  interactive = true 
}: RealtimeDrapeViewProps) {
  // Realtime controls
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(-0.1);
  const [scale, setScale] = useState(0.8);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(0.85);

  // Auto-adjust based on pose data
  useEffect(() => {
    if (poseData?.landmarks) {
      // Use shoulder landmarks to position saree
      const leftShoulder = poseData.landmarks.find((_, i) => i === 11);
      const rightShoulder = poseData.landmarks.find((_, i) => i === 12);
      const leftHip = poseData.landmarks.find((_, i) => i === 23);
      const rightHip = poseData.landmarks.find((_, i) => i === 24);
      
      if (leftShoulder && rightShoulder && leftHip && rightHip) {
        // Calculate center position
        const centerX = ((leftShoulder.x + rightShoulder.x) / 2 - 0.5) * 2;
        const centerY = -((leftShoulder.y + leftHip.y) / 2 - 0.5) * 2;
        
        // Calculate scale based on body size
        const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
        const bodyHeight = Math.abs(leftHip.y - leftShoulder.y);
        const bodyScale = Math.max(shoulderWidth, bodyHeight) * 2;
        
        setOffsetX(centerX * 0.5);
        setOffsetY(centerY * 0.3);
        setScale(Math.min(Math.max(bodyScale, 0.5), 1.5));
      }
    }
  }, [poseData]);

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas with image and drape */}
      <Canvas
        camera={{ position: [0, 0, 2], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      >
        <DrapeScene
          uploadedImage={uploadedImage}
          sareeColor={sareeColor}
          drapingStyle={drapingStyle}
          measurements={measurements}
          poseData={poseData}
          offsetX={offsetX}
          offsetY={offsetY}
          scale={scale}
          rotation={rotation}
          opacity={opacity}
          interactive={interactive}
        />
      </Canvas>

      {/* Realtime Controls Panel */}
      {interactive && (
        <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-md rounded-xl p-4 space-y-4">
          <div className="text-sm font-medium text-foreground mb-2">Adjust Drape Position</div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Horizontal</Label>
              <Slider
                value={[offsetX]}
                onValueChange={([v]) => setOffsetX(v)}
                min={-1}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Vertical</Label>
              <Slider
                value={[offsetY]}
                onValueChange={([v]) => setOffsetY(v)}
                min={-1}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Size</Label>
              <Slider
                value={[scale]}
                onValueChange={([v]) => setScale(v)}
                min={0.3}
                max={2}
                step={0.01}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Opacity</Label>
              <Slider
                value={[opacity]}
                onValueChange={([v]) => setOpacity(v)}
                min={0.3}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Rotation</Label>
            <Slider
              value={[rotation]}
              onValueChange={([v]) => setRotation(v)}
              min={-0.5}
              max={0.5}
              step={0.01}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
