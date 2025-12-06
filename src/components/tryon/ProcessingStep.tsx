import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, User, Layers, Palette, CheckCircle } from 'lucide-react';
import { DrapingStyle, Measurements, PoseData } from '@/types/tryon';
import { sarees, drapingStyles } from '@/data/sarees';
import { RealtimeDrapeView } from './RealtimeDrapeView';

interface ProcessingStepProps {
  onComplete: () => void;
  sareeId: string;
  drapingStyle: DrapingStyle;
  measurements?: Measurements;
  poseData?: PoseData;
  uploadedImage?: string | null;
}

const processingSteps = [
  { id: 'avatar', label: 'Creating 3D Avatar', icon: User, duration: 2000 },
  { id: 'mesh', label: 'Building Body Mesh (6,890 vertices)', icon: Layers, duration: 1500 },
  { id: 'drape', label: 'Applying Physics Simulation', icon: Sparkles, duration: 2500 },
  { id: 'render', label: 'Rendering Final Image', icon: Palette, duration: 1500 }
];

export function ProcessingStep({ onComplete, sareeId, drapingStyle, measurements, poseData, uploadedImage }: ProcessingStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showAvatar, setShowAvatar] = useState(false);
  const [showSaree, setShowSaree] = useState(false);
  const [sareeProgress, setSareeProgress] = useState(0);

  const saree = sarees.find(s => s.id === sareeId);
  const style = drapingStyles.find(s => s.id === drapingStyle);

  useEffect(() => {
    let totalDuration = 0;
    const stepIntervals: NodeJS.Timeout[] = [];

    processingSteps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index);
        
        // Show avatar when creating avatar step starts
        if (index === 0) {
          setTimeout(() => setShowAvatar(true), 500);
        }
        
        // Start showing saree during physics simulation
        if (index === 2) {
          setShowSaree(true);
          // Animate saree appearance
          let sareeAnim = 0;
          const sareeInterval = setInterval(() => {
            sareeAnim += 0.05;
            setSareeProgress(Math.min(sareeAnim, 1));
            if (sareeAnim >= 1) clearInterval(sareeInterval);
          }, 100);
        }
      }, totalDuration);
      stepIntervals.push(timeout);
      totalDuration += step.duration;
    });

    // Complete
    const completeTimeout = setTimeout(() => {
      setCurrentStep(processingSteps.length);
      setTimeout(onComplete, 500);
    }, totalDuration);
    stepIntervals.push(completeTimeout);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (totalDuration / 100));
      });
    }, 100);

    return () => {
      stepIntervals.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <section className="min-h-[calc(100vh-5rem)] py-12 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-medium mb-4">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</span>
              Processing
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Creating Your Virtual Try-On
            </h1>
            <p className="text-muted-foreground text-lg">
              Our AI is generating your personalized 3D saree draping
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 3D Preview */}
            <Card variant="gold" className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-gradient-to-br from-background via-muted/20 to-background relative">
                  {uploadedImage ? (
                    <RealtimeDrapeView
                      uploadedImage={uploadedImage}
                      sareeColor={saree?.color || '#8B0000'}
                      drapingStyle={drapingStyle}
                      measurements={measurements}
                      poseData={poseData}
                      interactive={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Processing...
                    </div>
                  )}
                  
                  {/* Overlay labels */}
                  <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-md rounded-lg px-3 py-2">
                    <span className="text-sm font-medium text-primary">3D Preview</span>
                  </div>
                  
                  {currentStep >= 2 && (
                    <div className="absolute bottom-4 left-4 right-4 bg-card/80 backdrop-blur-md rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{style?.name} Draping</p>
                          <p className="text-xs text-muted-foreground">{style?.pleats} pleats • {style?.palluPosition}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Processing Steps */}
            <Card variant="elevated" className="overflow-hidden">
              <CardContent className="p-6">
                {/* Selection Summary */}
                <div className="flex items-center justify-center gap-6 mb-6 pb-6 border-b border-border">
                  <div className="text-center">
                    <div 
                      className="w-14 h-14 rounded-xl mx-auto mb-2"
                      style={{ backgroundColor: saree?.color }}
                    />
                    <p className="text-sm text-foreground font-medium">{saree?.name}</p>
                  </div>
                  <div className="text-xl text-muted-foreground">+</div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="w-6 h-6 text-secondary" />
                    </div>
                    <p className="text-sm text-foreground font-medium">{style?.name}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Processing...</span>
                    <span className="text-primary font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  {processingSteps.map((step, index) => {
                    const isActive = currentStep === index;
                    const isComplete = currentStep > index;
                    const Icon = step.icon;

                    return (
                      <div 
                        key={step.id}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                          ${isActive ? 'bg-primary/10 border border-primary/30' : ''}
                          ${isComplete ? 'opacity-60' : ''}
                        `}
                      >
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                          ${isComplete 
                            ? 'bg-green-500' 
                            : isActive 
                              ? 'bg-primary animate-pulse' 
                              : 'bg-muted'
                          }
                        `}>
                          {isComplete ? (
                            <CheckCircle className="w-5 h-5 text-primary-foreground" />
                          ) : (
                            <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </p>
                          {isActive && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                              <span className="text-primary text-xs">In progress...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Physics info */}
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-muted-foreground text-xs text-center">
                    <span className="text-primary font-medium">Physics Engine:</span>{' '}
                    Simulating 10,000+ cloth particles with {saree?.fabricType} properties
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
