import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

interface Avatar3DProps {
  measurements?: {
    height: number;
    bust: number;
    waist: number;
    hips: number;
    shoulderWidth: number;
  };
}

export function Avatar3D({ measurements }: Avatar3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Scale factors based on measurements
  const scale = useMemo(() => {
    if (!measurements) return { height: 1.7, bust: 0.45, waist: 0.35, hips: 0.48, shoulder: 0.42 };
    return {
      height: measurements.height / 100,
      bust: measurements.bust / 200,
      waist: measurements.waist / 200,
      hips: measurements.hips / 200,
      shoulder: measurements.shoulderWidth / 100,
    };
  }, [measurements]);

  // Create body geometry with proper proportions
  const bodyGeometry = useMemo(() => {
    const torsoHeight = scale.height * 0.35;
    const bodyParts: THREE.BufferGeometry[] = [];

    // Torso - using lathe geometry for smooth curves
    const torsoPoints = [
      new THREE.Vector2(scale.shoulder * 0.5, torsoHeight * 0.5),
      new THREE.Vector2(scale.bust * 0.55, torsoHeight * 0.35),
      new THREE.Vector2(scale.waist * 0.5, 0),
      new THREE.Vector2(scale.hips * 0.55, -torsoHeight * 0.3),
      new THREE.Vector2(scale.hips * 0.5, -torsoHeight * 0.5),
    ];
    
    const torsoGeo = new THREE.LatheGeometry(torsoPoints, 32);
    torsoGeo.translate(0, scale.height * 0.55, 0);
    bodyParts.push(torsoGeo);

    // Head
    const headGeo = new THREE.SphereGeometry(0.1, 32, 32);
    headGeo.translate(0, scale.height * 0.9, 0);
    bodyParts.push(headGeo);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.08, 16);
    neckGeo.translate(0, scale.height * 0.82, 0);
    bodyParts.push(neckGeo);

    // Left Arm
    const leftArmGeo = new THREE.CapsuleGeometry(0.04, 0.45, 8, 16);
    leftArmGeo.rotateZ(Math.PI / 8);
    leftArmGeo.translate(-scale.shoulder * 0.6, scale.height * 0.65, 0);
    bodyParts.push(leftArmGeo);

    // Right Arm
    const rightArmGeo = new THREE.CapsuleGeometry(0.04, 0.45, 8, 16);
    rightArmGeo.rotateZ(-Math.PI / 8);
    rightArmGeo.translate(scale.shoulder * 0.6, scale.height * 0.65, 0);
    bodyParts.push(rightArmGeo);

    // Left Leg
    const leftLegGeo = new THREE.CapsuleGeometry(0.06, 0.7, 8, 16);
    leftLegGeo.translate(-0.1, scale.height * 0.22, 0);
    bodyParts.push(leftLegGeo);

    // Right Leg
    const rightLegGeo = new THREE.CapsuleGeometry(0.06, 0.7, 8, 16);
    rightLegGeo.translate(0.1, scale.height * 0.22, 0);
    bodyParts.push(rightLegGeo);

    // Merge all geometries
    return mergeGeometries(bodyParts);
  }, [scale]);

  // Slow rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.8, 0]}>
      <mesh geometry={bodyGeometry}>
        <meshStandardMaterial
          color="#d4a574"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}
