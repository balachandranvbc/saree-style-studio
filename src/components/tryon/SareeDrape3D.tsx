import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DrapingStyle } from '@/types/tryon';

interface SareeDrape3DProps {
  color: string;
  drapingStyle: DrapingStyle;
  progress: number; // 0 to 1 for animation
  measurements?: {
    height: number;
    bust: number;
    waist: number;
    hips: number;
    shoulderWidth: number;
  };
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

export function SareeDrape3D({ color, drapingStyle, progress, measurements }: SareeDrape3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  const config = styleConfigs[drapingStyle];
  
  // Scale based on measurements
  const scale = useMemo(() => {
    if (!measurements) return { height: 1.7, waist: 0.35, hips: 0.48 };
    return {
      height: measurements.height / 100,
      waist: measurements.waist / 200,
      hips: measurements.hips / 200,
    };
  }, [measurements]);

  // Create cloth geometry that wraps around body
  const clothGeometry = useMemo(() => {
    const segments = 64;
    const heightSegments = 48;
    const geometry = new THREE.PlaneGeometry(5, 2, segments, heightSegments);
    
    const positions = geometry.attributes.position;
    const wrapRadius = scale.waist + 0.05;
    const hipRadius = scale.hips + 0.05;
    
    for (let i = 0; i <= heightSegments; i++) {
      for (let j = 0; j <= segments; j++) {
        const index = i * (segments + 1) + j;
        
        // Normalized coordinates
        const u = j / segments;
        const v = i / heightSegments;
        
        // Wrap angle (how much around the body)
        const wrapAngle = u * Math.PI * 2 * config.wrapDirection;
        
        // Height along the body
        const bodyHeight = v * scale.height * 0.55 + scale.height * 0.15;
        
        // Radius varies from waist to hips
        const radius = THREE.MathUtils.lerp(wrapRadius, hipRadius, Math.pow(1 - v, 2));
        
        // Calculate 3D position
        let x = Math.sin(wrapAngle) * radius;
        let y = bodyHeight;
        let z = Math.cos(wrapAngle) * radius;
        
        // Add pleats at the front
        if (config.pleats > 0 && u > 0.3 && u < 0.7 && v > 0.7) {
          const pleatFactor = Math.sin(u * config.pleats * Math.PI) * 0.02;
          x += pleatFactor;
          z += pleatFactor * 0.5;
        }
        
        // Pallu drape over shoulder
        if (v < 0.3) {
          const palluOffset = config.palluSide === 'left' ? -0.2 : 0.2;
          x += palluOffset * (1 - v / 0.3) * config.palluLength;
          y += 0.3 * (1 - v / 0.3);
          z -= 0.1 * (1 - v / 0.3);
        }
        
        // Add slight wave/flow
        x += Math.sin(v * 3 + u * 2) * 0.01;
        z += Math.cos(v * 2 + u * 3) * 0.01;
        
        positions.setXYZ(index, x, y, z);
      }
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, [scale, config]);

  // Animate cloth appearance
  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      // Subtle movement animation
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.3;
      
      // Update opacity based on progress
      materialRef.current.opacity = Math.min(progress * 1.5, 1);
    }
  });

  // Parse color
  const sareeColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <mesh ref={meshRef} geometry={clothGeometry} position={[0, -0.8, 0]}>
      <meshStandardMaterial
        ref={materialRef}
        color={sareeColor}
        side={THREE.DoubleSide}
        roughness={0.4}
        metalness={0.2}
        transparent
        opacity={0}
      />
    </mesh>
  );
}
