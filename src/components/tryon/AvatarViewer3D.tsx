import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Center, ContactShadows } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface AvatarViewerProps {
  glbUrl: string;
  sareeColor?: string;
  showControls?: boolean;
}

function AvatarModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 1, 0.3]} />
      <meshStandardMaterial color="#d4a574" wireframe />
    </mesh>
  );
}

export function AvatarViewer3D({ glbUrl, sareeColor, showControls = true }: AvatarViewerProps) {
  const [zoom, setZoom] = useState(2.5);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0.5, zoom], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          <spotLight position={[0, 5, 0]} intensity={0.5} angle={0.5} penumbra={1} />
          
          {/* Environment */}
          <Environment preset="studio" />
          
          {/* Avatar */}
          <Center>
            <AvatarModel url={glbUrl} />
          </Center>
          
          {/* Shadow */}
          <ContactShadows
            position={[0, -0.85, 0]}
            opacity={0.4}
            scale={3}
            blur={2.5}
          />
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
            minDistance={1}
            maxDistance={5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>

      {/* Control Panel */}
      {showControls && (
        <Card className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={autoRotate ? 'bg-primary/20' : ''}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  {autoRotate ? 'Auto-rotate ON' : 'Auto-rotate OFF'}
                </span>
              </div>
              
              <div className="flex items-center gap-3 flex-1 max-w-xs">
                <ZoomOut className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={[zoom]}
                  onValueChange={([v]) => setZoom(v)}
                  min={1}
                  max={5}
                  step={0.1}
                  className="flex-1"
                />
                <ZoomIn className="w-4 h-4 text-muted-foreground" />
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Move className="w-4 h-4" />
                <span>Drag to rotate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Preload function for better performance
export function preloadAvatar(url: string) {
  useGLTF.preload(url);
}
