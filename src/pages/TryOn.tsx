import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { UploadStep } from '@/components/tryon/UploadStep';
import { MeasurementsStep } from '@/components/tryon/MeasurementsStep';
import { SareeSelectionStep } from '@/components/tryon/SareeSelectionStep';
import { ProcessingStep } from '@/components/tryon/ProcessingStep';
import { ResultStep } from '@/components/tryon/ResultStep';
import { AvatarCreatorStep } from '@/components/tryon/AvatarCreatorStep';
import { Measurements, DrapingStyle, PoseData } from '@/types/tryon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Box, Sparkles } from 'lucide-react';

type Step = 'mode-select' | 'upload' | 'avatar-creator' | 'measurements' | 'saree-selection' | 'processing' | 'result';
type Mode = 'photo' | '3d-avatar';

const TryOn = () => {
  const [currentStep, setCurrentStep] = useState<Step>('mode-select');
  const [mode, setMode] = useState<Mode>('photo');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [poseData, setPoseData] = useState<PoseData | null>(null);
  const [measurements, setMeasurements] = useState<Measurements | null>(null);
  const [selectedSareeId, setSelectedSareeId] = useState<string | null>(null);
  const [selectedDrapingStyle, setSelectedDrapingStyle] = useState<DrapingStyle>('nivi');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [avatarGlbUrl, setAvatarGlbUrl] = useState<string | null>(null);

  const handleModeSelect = (selectedMode: Mode) => {
    setMode(selectedMode);
    if (selectedMode === 'photo') {
      setCurrentStep('upload');
    } else {
      setCurrentStep('avatar-creator');
    }
  };

  const handleImageUpload = (imageUrl: string, detectedPose?: PoseData) => {
    setUploadedImage(imageUrl);
    if (detectedPose) {
      setPoseData(detectedPose);
      setMeasurements({
        height: 165,
        bust: 90,
        waist: detectedPose.estimatedMeasurements.hipWidth * 0.8,
        hips: detectedPose.estimatedMeasurements.hipWidth,
        shoulderWidth: detectedPose.estimatedMeasurements.shoulderWidth,
      });
    }
    setCurrentStep('measurements');
  };

  const handleAvatarCreated = (avatarUrl: string, glbUrl: string) => {
    setAvatarGlbUrl(glbUrl);
    // Set default measurements for avatar mode
    setMeasurements({
      height: 170,
      bust: 90,
      waist: 70,
      hips: 95,
      shoulderWidth: 38,
    });
    setCurrentStep('measurements');
  };

  const handleMeasurementsSubmit = (newMeasurements: Measurements) => {
    setMeasurements(newMeasurements);
    setCurrentStep('saree-selection');
  };

  const handleSareeSelect = (sareeId: string, style: DrapingStyle) => {
    setSelectedSareeId(sareeId);
    setSelectedDrapingStyle(style);
    setCurrentStep('processing');
  };

  const handleProcessingComplete = (generatedImage: string) => {
    setResultImage(generatedImage);
    setCurrentStep('result');
  };

  const handleStartOver = () => {
    setCurrentStep('mode-select');
    setMode('photo');
    setUploadedImage(null);
    setPoseData(null);
    setMeasurements(null);
    setSelectedSareeId(null);
    setResultImage(null);
    setAvatarGlbUrl(null);
  };

  const renderModeSelect = () => (
    <section className="min-h-[calc(100vh-5rem)] py-12 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Choose Your Experience
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Virtual Saree Try-On
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
            Choose how you'd like to try on sarees - upload a photo for AI draping or create a 3D avatar
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Photo Mode */}
            <Card 
              variant="elevated" 
              className="cursor-pointer group hover:ring-2 hover:ring-primary transition-all"
              onClick={() => handleModeSelect('photo')}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Photo Mode
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Upload your photo and our AI will drape the saree on you with photorealistic results
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">AI Powered</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">Photorealistic</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">Quick</span>
                </div>
                <Button variant="gold" className="w-full mt-4">
                  Upload Photo
                </Button>
              </CardContent>
            </Card>

            {/* 3D Avatar Mode */}
            <Card 
              variant="elevated" 
              className="cursor-pointer group hover:ring-2 hover:ring-primary transition-all"
              onClick={() => handleModeSelect('3d-avatar')}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-gold/20 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Box className="w-10 h-10 text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    3D Avatar Mode
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Create a personalized 3D avatar with Ready Player Me and export GLB files
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">Interactive 3D</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">GLB Export</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">AR Ready</span>
                </div>
                <Button variant="outline" className="w-full mt-4 border-gold text-gold hover:bg-gold/10">
                  Create 3D Avatar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 'mode-select':
        return renderModeSelect();
      case 'upload':
        return <UploadStep onImageUpload={handleImageUpload} />;
      case 'avatar-creator':
        return (
          <AvatarCreatorStep 
            onAvatarCreated={handleAvatarCreated}
            onSkip={() => setCurrentStep('upload')}
          />
        );
      case 'measurements':
        return (
          <MeasurementsStep 
            onSubmit={handleMeasurementsSubmit}
            onBack={() => setCurrentStep(mode === 'photo' ? 'upload' : 'avatar-creator')}
            initialMeasurements={measurements || undefined}
            poseData={poseData || undefined}
          />
        );
      case 'saree-selection':
        return (
          <SareeSelectionStep 
            onSelect={handleSareeSelect}
            onBack={() => setCurrentStep('measurements')}
          />
        );
      case 'processing':
        return (
          <ProcessingStep 
            onComplete={handleProcessingComplete}
            sareeId={selectedSareeId!}
            drapingStyle={selectedDrapingStyle}
            measurements={measurements || undefined}
            poseData={poseData || undefined}
            uploadedImage={uploadedImage}
          />
        );
      case 'result':
        return (
          <ResultStep 
            uploadedImage={uploadedImage}
            resultImage={resultImage}
            sareeId={selectedSareeId!}
            drapingStyle={selectedDrapingStyle}
            measurements={measurements || undefined}
            poseData={poseData || undefined}
            onStartOver={handleStartOver}
          />
        );
      default:
        return renderModeSelect();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {renderStep()}
      </main>
      <Footer />
    </div>
  );
};

export default TryOn;
