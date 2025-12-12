import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { UploadStep } from '@/components/tryon/UploadStep';
import { DepthModelStep } from '@/components/tryon/DepthModelStep';
import { MeasurementsStep } from '@/components/tryon/MeasurementsStep';
import { SareeSelectionStep } from '@/components/tryon/SareeSelectionStep';
import { ProcessingStep } from '@/components/tryon/ProcessingStep';
import { ResultStep } from '@/components/tryon/ResultStep';
import { Measurements, DrapingStyle, PoseData } from '@/types/tryon';
import { DepthModelData } from '@/lib/depthEstimation';

type Step = 'upload' | 'depth-model' | 'measurements' | 'saree-selection' | 'processing' | 'result';

const TryOn = () => {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [poseData, setPoseData] = useState<PoseData | null>(null);
  const [depthData, setDepthData] = useState<DepthModelData | null>(null);
  const [measurements, setMeasurements] = useState<Measurements | null>(null);
  const [selectedSareeId, setSelectedSareeId] = useState<string | null>(null);
  const [selectedDrapingStyle, setSelectedDrapingStyle] = useState<DrapingStyle>('nivi');
  const [resultImage, setResultImage] = useState<string | null>(null);

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
    // Go to depth model step instead of measurements
    setCurrentStep('depth-model');
  };

  const handleDepthModelComplete = (data: DepthModelData) => {
    setDepthData(data);
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
    setCurrentStep('upload');
    setUploadedImage(null);
    setPoseData(null);
    setDepthData(null);
    setMeasurements(null);
    setSelectedSareeId(null);
    setResultImage(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'upload':
        return <UploadStep onImageUpload={handleImageUpload} />;
      case 'depth-model':
        return (
          <DepthModelStep 
            uploadedImage={uploadedImage!}
            poseData={poseData || undefined}
            onContinue={handleDepthModelComplete}
            onBack={() => setCurrentStep('upload')}
          />
        );
      case 'measurements':
        return (
          <MeasurementsStep 
            onSubmit={handleMeasurementsSubmit}
            onBack={() => setCurrentStep('depth-model')}
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
        return <UploadStep onImageUpload={handleImageUpload} />;
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
