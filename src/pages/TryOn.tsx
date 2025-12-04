import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { UploadStep } from '@/components/tryon/UploadStep';
import { MeasurementsStep } from '@/components/tryon/MeasurementsStep';
import { SareeSelectionStep } from '@/components/tryon/SareeSelectionStep';
import { ProcessingStep } from '@/components/tryon/ProcessingStep';
import { ResultStep } from '@/components/tryon/ResultStep';
import { Measurements, DrapingStyle } from '@/types/tryon';

type Step = 'upload' | 'measurements' | 'saree-selection' | 'processing' | 'result';

const TryOn = () => {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Measurements | null>(null);
  const [selectedSareeId, setSelectedSareeId] = useState<string | null>(null);
  const [selectedDrapingStyle, setSelectedDrapingStyle] = useState<DrapingStyle>('nivi');

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
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

  const handleProcessingComplete = () => {
    setCurrentStep('result');
  };

  const handleStartOver = () => {
    setCurrentStep('upload');
    setUploadedImage(null);
    setMeasurements(null);
    setSelectedSareeId(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'upload':
        return <UploadStep onImageUpload={handleImageUpload} />;
      case 'measurements':
        return (
          <MeasurementsStep 
            onSubmit={handleMeasurementsSubmit}
            onBack={() => setCurrentStep('upload')}
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
          />
        );
      case 'result':
        return (
          <ResultStep 
            uploadedImage={uploadedImage}
            sareeId={selectedSareeId!}
            drapingStyle={selectedDrapingStyle}
            measurements={measurements || undefined}
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
