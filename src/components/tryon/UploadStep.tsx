import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera, Image, Sparkles, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import { drawPoseLandmarks } from '@/lib/poseDetection';
import { PoseData } from '@/types/tryon';

interface UploadStepProps {
  onImageUpload: (imageUrl: string, poseData?: PoseData) => void;
}

export function UploadStep({ onImageUpload }: UploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [poseData, setPoseData] = useState<PoseData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDetecting, error, detectFromImage } = usePoseDetection();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setPoseData(null);
      
      // Run pose detection
      const detected = await detectFromImage(result);
      if (detected) {
        setPoseData({
          landmarks: detected.landmarks,
          anchors: detected.anchors,
          estimatedMeasurements: detected.measurements,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Draw pose landmarks on canvas
  useEffect(() => {
    if (preview && poseData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new window.Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        drawPoseLandmarks(ctx, poseData.landmarks, img.width, img.height);
      };
      img.src = preview;
    }
  }, [preview, poseData]);

  const handleContinue = () => {
    if (preview) {
      onImageUpload(preview, poseData || undefined);
    }
  };

  const tips = [
    'Stand facing the camera directly',
    'Wear fitted clothes for accurate measurements',
    'Good lighting helps our AI work better',
    'Arms slightly away from body'
  ];

  return (
    <section className="min-h-[calc(100vh-5rem)] py-12 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-medium mb-4">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
              Step 1 of 5
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upload Your Photo
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Our AI will convert your photo into a 3D depth model for realistic saree draping
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Area */}
            <Card variant="gold" className="overflow-hidden">
              <CardContent className="p-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !isDetecting && fileInputRef.current?.click()}
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                    transition-all duration-300 min-h-[300px] flex flex-col items-center justify-center
                    ${isDragging 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }
                    ${preview ? 'border-solid border-primary' : ''}
                    ${isDetecting ? 'pointer-events-none' : ''}
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {preview ? (
                    <div className="space-y-4 w-full">
                      <div className="relative w-48 h-64 mx-auto rounded-lg overflow-hidden shadow-lg">
                        {poseData ? (
                          <canvas 
                            ref={canvasRef}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img 
                            src={preview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        )}
                        
                        {isDetecting && (
                          <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                            <span className="text-sm text-foreground font-medium">Detecting pose...</span>
                          </div>
                        )}
                        
                        {poseData && !isDetecting && (
                          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {error && (
                        <div className="flex items-center gap-2 text-destructive text-sm justify-center">
                          <AlertCircle className="w-4 h-4" />
                          {error}
                        </div>
                      )}
                      
                      {poseData && (
                        <div className="bg-muted/50 rounded-lg p-3 text-sm">
                          <p className="text-foreground font-medium mb-2">✓ Pose Detected - {poseData.landmarks.length} landmarks</p>
                          <div className="grid grid-cols-2 gap-2 text-muted-foreground text-xs">
                            <span>Shoulder: ~{poseData.estimatedMeasurements.shoulderWidth}cm</span>
                            <span>Torso: ~{poseData.estimatedMeasurements.torsoHeight}cm</span>
                            <span>Hip: ~{poseData.estimatedMeasurements.hipWidth}cm</span>
                            <span>Arm: ~{poseData.estimatedMeasurements.armLength}cm</span>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-muted-foreground text-sm">Click to change photo</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center mb-6">
                        <Upload className="w-10 h-10 text-primary-foreground" />
                      </div>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                        Drag & Drop Your Photo
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        or click to browse files
                      </p>
                      <div className="flex gap-2 justify-center">
                        <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs">JPG</span>
                        <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs">PNG</span>
                        <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs">HEIC</span>
                      </div>
                    </>
                  )}
                </div>

                {preview && !isDetecting && (
                  <Button 
                    variant="gold" 
                    size="lg" 
                    className="w-full mt-6"
                    onClick={handleContinue}
                    disabled={!poseData}
                  >
                    <Sparkles className="w-5 h-5" />
                    {poseData ? 'Continue to Measurements' : 'Waiting for pose detection...'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <div className="space-y-6">
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Photo Tips
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">{index + 1}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Image className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      AI-Powered Detection
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Using Google's MediaPipe Pose Landmarker to detect 33 body landmarks 
                    for accurate 3D avatar generation. All processing happens in your browser.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
