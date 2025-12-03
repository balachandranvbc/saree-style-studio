import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, User, Layers, Palette, CheckCircle } from 'lucide-react';
import { DrapingStyle } from '@/types/tryon';
import { sarees, drapingStyles } from '@/data/sarees';

interface ProcessingStepProps {
  onComplete: () => void;
  sareeId: string;
  drapingStyle: DrapingStyle;
}

const processingSteps = [
  { id: 'avatar', label: 'Creating 3D Avatar', icon: User, duration: 2000 },
  { id: 'mesh', label: 'Building Body Mesh (6,890 vertices)', icon: Layers, duration: 1500 },
  { id: 'drape', label: 'Applying Physics Simulation', icon: Sparkles, duration: 2500 },
  { id: 'render', label: 'Rendering Final Image', icon: Palette, duration: 1500 }
];

export function ProcessingStep({ onComplete, sareeId, drapingStyle }: ProcessingStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const saree = sarees.find(s => s.id === sareeId);
  const style = drapingStyles.find(s => s.id === drapingStyle);

  useEffect(() => {
    let totalDuration = 0;
    const stepIntervals: NodeJS.Timeout[] = [];

    processingSteps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index);
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
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-medium mb-4">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</span>
              Processing
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Creating Your Virtual Try-On
            </h1>
            <p className="text-muted-foreground text-lg">
              Our AI is generating your personalized saree experience
            </p>
          </div>

          {/* Processing Card */}
          <Card variant="gold" className="overflow-hidden">
            <CardContent className="p-8">
              {/* Selection Summary */}
              <div className="flex items-center justify-center gap-6 mb-8 pb-6 border-b border-border">
                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-xl mx-auto mb-2"
                    style={{ backgroundColor: saree?.color }}
                  />
                  <p className="text-sm text-foreground font-medium">{saree?.name}</p>
                </div>
                <div className="text-2xl text-muted-foreground">+</div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-8 h-8 text-secondary" />
                  </div>
                  <p className="text-sm text-foreground font-medium">{style?.name}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Processing...</span>
                  <span className="text-primary font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {processingSteps.map((step, index) => {
                  const isActive = currentStep === index;
                  const isComplete = currentStep > index;
                  const Icon = step.icon;

                  return (
                    <div 
                      key={step.id}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                        ${isActive ? 'bg-primary/10 border border-primary/30' : ''}
                        ${isComplete ? 'opacity-60' : ''}
                      `}
                    >
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                        ${isComplete 
                          ? 'bg-green-500' 
                          : isActive 
                            ? 'bg-primary animate-pulse' 
                            : 'bg-muted'
                        }
                      `}>
                        {isComplete ? (
                          <CheckCircle className="w-6 h-6 text-primary-foreground" />
                        ) : (
                          <Icon className={`w-6 h-6 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                        {isActive && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            <span className="text-primary text-sm">In progress...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Fun facts */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              <span className="text-primary font-medium">Did you know?</span>{' '}
              Our physics engine simulates over 10,000 cloth particles to achieve realistic draping.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
