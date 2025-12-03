import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Ruler, Sparkles, Info } from 'lucide-react';
import { Measurements } from '@/types/tryon';

interface MeasurementsStepProps {
  onSubmit: (measurements: Measurements) => void;
  onBack: () => void;
}

export function MeasurementsStep({ onSubmit, onBack }: MeasurementsStepProps) {
  const [measurements, setMeasurements] = useState<Measurements>({
    height: 160,
    bust: 86,
    waist: 71,
    hips: 96,
    shoulderWidth: 40
  });

  const [useAuto, setUseAuto] = useState(false);

  const handleChange = (field: keyof Measurements, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleAutoDetect = () => {
    setUseAuto(true);
    // Simulate AI detection with random realistic values
    setTimeout(() => {
      setMeasurements({
        height: 162,
        bust: 88,
        waist: 72,
        hips: 98,
        shoulderWidth: 41
      });
      setUseAuto(false);
    }, 1500);
  };

  const measurementFields = [
    { key: 'height', label: 'Height', unit: 'cm', min: 140, max: 200, description: 'Your total height standing straight' },
    { key: 'bust', label: 'Bust', unit: 'cm', min: 70, max: 130, description: 'Around the fullest part of your bust' },
    { key: 'waist', label: 'Waist', unit: 'cm', min: 55, max: 120, description: 'Around your natural waistline' },
    { key: 'hips', label: 'Hips', unit: 'cm', min: 80, max: 140, description: 'Around the fullest part of your hips' },
    { key: 'shoulderWidth', label: 'Shoulder Width', unit: 'cm', min: 30, max: 55, description: 'From shoulder edge to shoulder edge' }
  ];

  return (
    <section className="min-h-[calc(100vh-5rem)] py-12 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-medium mb-4">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
              Step 2 of 4
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Body Measurements
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Enter your measurements for a perfectly fitted 3D avatar, or let our AI detect them automatically
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Measurements Form */}
            <div className="lg:col-span-2">
              <Card variant="gold">
                <CardContent className="p-6">
                  {/* Auto-detect button */}
                  <Button 
                    variant="maroon" 
                    className="w-full mb-6"
                    onClick={handleAutoDetect}
                    disabled={useAuto}
                  >
                    {useAuto ? (
                      <>
                        <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                        AI Analyzing Your Photo...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Auto-Detect from Photo
                      </>
                    )}
                  </Button>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-4 text-muted-foreground text-sm">or enter manually</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {measurementFields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={field.key} className="text-foreground font-medium">
                            {field.label}
                          </Label>
                          <span className="text-muted-foreground text-xs">{field.unit}</span>
                        </div>
                        <div className="relative">
                          <Input
                            id={field.key}
                            type="number"
                            min={field.min}
                            max={field.max}
                            value={measurements[field.key as keyof Measurements]}
                            onChange={(e) => handleChange(field.key as keyof Measurements, e.target.value)}
                            className="pr-12 bg-muted border-border focus:border-primary"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            {field.unit}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          {field.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-4 mt-8">
                    <Button variant="outline" size="lg" onClick={onBack}>
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </Button>
                    <Button 
                      variant="gold" 
                      size="lg" 
                      className="flex-1"
                      onClick={() => onSubmit(measurements)}
                    >
                      Continue to Saree Selection
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Ruler className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Why Measurements?
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    Accurate measurements help our SMPL body model create a 3D avatar that matches your exact proportions.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      6,890 vertex body mesh
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      23 body joints tracked
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      &lt; 2cm accuracy
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                    Avatar Preview
                  </h3>
                  <div className="aspect-[3/4] rounded-lg bg-muted/50 border border-border flex items-center justify-center">
                    <div className="text-center text-muted-foreground text-sm p-4">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                      </div>
                      Your 3D avatar will appear here
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
