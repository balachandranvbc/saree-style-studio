import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, User, Layers, Palette, CheckCircle, AlertCircle, Cpu, Wand2 } from 'lucide-react';
import { DrapingStyle, Measurements, PoseData } from '@/types/tryon';
import { sarees, drapingStyles } from '@/data/sarees';
import { RealtimeDrapeView } from './RealtimeDrapeView';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProcessingStepProps {
  onComplete: (resultImage: string) => void;
  sareeId: string;
  drapingStyle: DrapingStyle;
  measurements?: Measurements;
  poseData?: PoseData;
  uploadedImage?: string | null;
}

const processingSteps = [
  { id: 'analyze', label: 'Analyzing Body & Pose', icon: User, status: 'Detecting body shape and proportions' },
  { id: 'avatar', label: 'Creating 3D Avatar', icon: Layers, status: 'Building mesh with 6,890+ vertices' },
  { id: 'drape', label: 'AI Saree Draping', icon: Wand2, status: 'Generating realistic fabric simulation' },
  { id: 'render', label: 'Final Rendering', icon: Palette, status: 'Matching lighting and colors' }
];

export function ProcessingStep({ onComplete, sareeId, drapingStyle, measurements, poseData, uploadedImage }: ProcessingStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const { toast } = useToast();
  const hasStarted = useRef(false);

  const saree = sarees.find(s => s.id === sareeId);
  const style = drapingStyles.find(s => s.id === drapingStyle);

  useEffect(() => {
    if (hasStarted.current || !uploadedImage) return;
    hasStarted.current = true;

    const processImage = async () => {
      try {
        // Step 1: Analyze
        setCurrentStep(0);
        setProgress(10);
        await new Promise(r => setTimeout(r, 1000));

        // Step 2: Avatar
        setCurrentStep(1);
        setProgress(25);
        await new Promise(r => setTimeout(r, 1000));

        // Step 3: AI Draping
        setCurrentStep(2);
        setProgress(40);

        console.log('Calling AI drape-saree function...');

        const { data, error: fnError } = await supabase.functions.invoke('drape-saree', {
          body: {
            imageBase64: uploadedImage,
            drapingStyle: drapingStyle,
            sareeColor: saree?.color || '#8B0000',
            secondaryColor: null,
            fabric: saree?.fabricType || 'silk',
            borderStyle: 'Traditional gold zari border',
            pattern: null,
            poseData: poseData,
            measurements: measurements
          }
        });

        if (fnError) {
          console.error('Edge function error:', fnError);
          throw new Error(fnError.message || 'Failed to process image');
        }

        if (data?.error) {
          console.error('Processing error:', data.error);
          if (data.code === 'RATE_LIMIT') {
            throw new Error('AI is busy. Please try again in a moment.');
          }
          if (data.code === 'PAYMENT_REQUIRED') {
            throw new Error('AI usage limit reached. Please try again later.');
          }
          throw new Error(data.error);
        }

        setProgress(80);
        
        // Step 4: Render
        setCurrentStep(3);
        await new Promise(r => setTimeout(r, 500));
        setProgress(100);

        console.log('AI draping complete!');

        // Complete with result image
        setTimeout(() => {
          onComplete(data.resultImage);
        }, 500);

      } catch (err) {
        console.error('Processing error:', err);
        const message = err instanceof Error ? err.message : 'Failed to generate saree draping';
        setError(message);
        setIsProcessing(false);
        toast({
          title: 'Processing Failed',
          description: message,
          variant: 'destructive'
        });
      }
    };

    processImage();
  }, [uploadedImage, sareeId, drapingStyle, measurements, poseData, onComplete, saree, toast]);

  const handleRetry = () => {
    setError(null);
    setIsProcessing(true);
    setCurrentStep(0);
    setProgress(0);
    hasStarted.current = false;
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] py-12 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-medium mb-4">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</span>
              AI Processing
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {error ? 'Processing Error' : 'Creating Your Virtual Try-On'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {error 
                ? 'Something went wrong during processing' 
                : 'Our AI is generating your personalized saree draping'}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Preview */}
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
                      No image uploaded
                    </div>
                  )}
                  
                  {/* AI Badge */}
                  <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-md rounded-lg px-3 py-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">AI Processing</span>
                  </div>
                  
                  {currentStep >= 2 && !error && (
                    <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-md rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{style?.name} Draping</p>
                          <p className="text-xs text-muted-foreground">{saree?.fabricType} fabric • Realistic physics</p>
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
                      className="w-14 h-14 rounded-xl mx-auto mb-2 shadow-lg"
                      style={{ backgroundColor: saree?.color }}
                    />
                    <p className="text-sm text-foreground font-medium">{saree?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{saree?.fabricType}</p>
                  </div>
                  <div className="text-xl text-muted-foreground">+</div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="w-6 h-6 text-secondary" />
                    </div>
                    <p className="text-sm text-foreground font-medium">{style?.name}</p>
                    <p className="text-xs text-muted-foreground">{style?.region}</p>
                  </div>
                </div>

                {error ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <p className="text-foreground font-medium mb-2">Processing Failed</p>
                    <p className="text-muted-foreground text-sm mb-6">{error}</p>
                    <Button onClick={handleRetry} className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">AI Processing...</span>
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
                                  <span className="text-primary text-xs">{step.status}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* AI info */}
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-muted-foreground text-xs text-center">
                    <span className="text-primary font-medium">Powered by:</span>{' '}
                    Lovable AI • Google Gemini Vision • Real-time cloth simulation
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
