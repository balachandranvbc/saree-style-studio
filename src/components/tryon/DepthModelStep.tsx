import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Loader2, Box, Sparkles, RotateCcw, Eye, Layers } from 'lucide-react';
import { estimateDepth, DepthModelData } from '@/lib/depthEstimation';
import { Depth3DViewer } from './Depth3DViewer';
import { PoseData } from '@/types/tryon';

interface DepthModelStepProps {
  uploadedImage: string;
  poseData?: PoseData;
  onContinue: (depthData: DepthModelData) => void;
  onBack: () => void;
}

export function DepthModelStep({ 
  uploadedImage, 
  poseData,
  onContinue, 
  onBack 
}: DepthModelStepProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [depthData, setDepthData] = useState<DepthModelData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'depth' | 'original'>('3d');
  const [displacementScale, setDisplacementScale] = useState([0.3]);

  useEffect(() => {
    processImage();
  }, [uploadedImage]);

  const processImage = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await estimateDepth(uploadedImage);
      setDepthData(result);
    } catch (err) {
      console.error('Depth estimation failed:', err);
      setError('Failed to create 3D depth model. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    if (depthData) {
      onContinue(depthData);
    }
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] py-12 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-medium mb-4">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
              Step 2 of 5
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              3D Depth Model
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Your photo has been converted into a 3D depth model for accurate saree draping
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* 3D Viewer */}
            <div className="lg:col-span-2">
              <Card variant="gold" className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-muted to-background">
                    {isProcessing ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 animate-pulse">
                          <Box className="w-10 h-10 text-primary animate-spin" />
                        </div>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                          Creating 3D Depth Model
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Analyzing body contours and generating depth...
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">Processing...</span>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                        <p className="text-destructive text-center mb-4">{error}</p>
                        <Button variant="outline" onClick={processImage}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    ) : depthData && (
                      <>
                        {viewMode === '3d' && (
                          <Depth3DViewer 
                            depthData={depthData}
                            displacementScale={displacementScale[0]}
                            className="w-full h-full"
                          />
                        )}
                        {viewMode === 'depth' && (
                          <img 
                            src={depthData.normalizedDepthImage}
                            alt="Depth Map"
                            className="w-full h-full object-contain"
                          />
                        )}
                        {viewMode === 'original' && (
                          <img 
                            src={uploadedImage}
                            alt="Original"
                            className="w-full h-full object-contain"
                          />
                        )}
                        
                        {/* View mode toggle */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-background/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
                          <button
                            onClick={() => setViewMode('3d')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              viewMode === '3d' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Box className="w-4 h-4 inline mr-1" />
                            3D View
                          </button>
                          <button
                            onClick={() => setViewMode('depth')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              viewMode === 'depth' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Layers className="w-4 h-4 inline mr-1" />
                            Depth Map
                          </button>
                          <button
                            onClick={() => setViewMode('original')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              viewMode === 'original' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Eye className="w-4 h-4 inline mr-1" />
                            Original
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    3D Depth Controls
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Depth Intensity
                      </label>
                      <Slider
                        value={displacementScale}
                        onValueChange={setDisplacementScale}
                        min={0.1}
                        max={0.8}
                        step={0.05}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Adjust how pronounced the 3D depth effect appears
                      </p>
                    </div>

                    {poseData && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs font-medium text-foreground mb-2">
                          Detected Body Points
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <span>Shoulders: {poseData.estimatedMeasurements.shoulderWidth}cm</span>
                          <span>Torso: {poseData.estimatedMeasurements.torsoHeight}cm</span>
                          <span>Hips: {poseData.estimatedMeasurements.hipWidth}cm</span>
                          <span>Arms: {poseData.estimatedMeasurements.armLength}cm</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      How It Works
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    Your photo is converted into a 3D depth model that preserves your face 
                    and body contours. This allows accurate saree draping with realistic 
                    folds and shadows.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      360° depth accuracy
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      Face preservation
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      Real fabric physics
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={onBack}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  variant="gold" 
                  onClick={handleContinue}
                  disabled={!depthData || isProcessing}
                  className="flex-1"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Choose Saree
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
