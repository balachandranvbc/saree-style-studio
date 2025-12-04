import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import { Avatar3D } from './Avatar3D';
import { SareeDrape3D } from './SareeDrape3D';
import { DrapingStyle, Measurements } from '@/types/tryon';

interface TryOnSceneProps {
  sareeColor: string;
  drapingStyle: DrapingStyle;
  measurements?: Measurements;
  progress?: number;
  showAvatar?: boolean;
  showSaree?: boolean;
  interactive?: boolean;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#d4a574" wireframe />
    </mesh>
  );
}

export function TryOnScene({
  sareeColor,
  drapingStyle,
  measurements,
  progress = 1,
  showAvatar = true,
  showSaree = true,
  interactive = true,
}: TryOnSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 2.5], fov: 45 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <Suspense fallback={<LoadingFallback />}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <spotLight position={[0, 5, 0]} intensity={0.5} angle={0.5} penumbra={1} />
        
        {/* Environment for realistic reflections */}
        <Environment preset="studio" />
        
        {/* Controls */}
        {interactive ? (
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
          >
            {/* Avatar */}
            {showAvatar && <Avatar3D measurements={measurements} />}
            
            {/* Saree */}
            {showSaree && (
              <SareeDrape3D
                color={sareeColor}
                drapingStyle={drapingStyle}
                progress={progress}
                measurements={measurements}
              />
            )}
          </PresentationControls>
        ) : (
          <>
            {showAvatar && <Avatar3D measurements={measurements} />}
            {showSaree && (
              <SareeDrape3D
                color={sareeColor}
                drapingStyle={drapingStyle}
                progress={progress}
                measurements={measurements}
              />
            )}
          </>
        )}
        
        {/* Ground shadow */}
        <ContactShadows
          position={[0, -0.85, 0]}
          opacity={0.4}
          scale={3}
          blur={2.5}
          far={1}
        />
        
        {/* Optional orbit controls for free rotation */}
        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={1.5}
            maxDistance={5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        )}
      </Suspense>
    </Canvas>
  );
}
