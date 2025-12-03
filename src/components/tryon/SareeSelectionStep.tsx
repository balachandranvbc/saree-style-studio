import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { DrapingStyle } from '@/types/tryon';
import { sarees, drapingStyles } from '@/data/sarees';
import { cn } from '@/lib/utils';

interface SareeSelectionStepProps {
  onSelect: (sareeId: string, drapingStyle: DrapingStyle) => void;
  onBack: () => void;
}

export function SareeSelectionStep({ onSelect, onBack }: SareeSelectionStepProps) {
  const [selectedSaree, setSelectedSaree] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<DrapingStyle>('nivi');

  const handleContinue = () => {
    if (selectedSaree) {
      onSelect(selectedSaree, selectedStyle);
    }
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-medium mb-4">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
              Step 3 of 4
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Saree & Style
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Select a saree from our collection and pick your preferred regional draping style
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Saree Selection */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Select a Saree
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {sarees.map((saree) => (
                  <Card
                    key={saree.id}
                    variant={selectedSaree === saree.id ? 'gold' : 'elevated'}
                    className={cn(
                      "cursor-pointer overflow-hidden group transition-all duration-300",
                      selectedSaree === saree.id && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedSaree(saree.id)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-[3/4] relative overflow-hidden">
                        {saree.image && saree.image !== '/placeholder.svg' ? (
                          <img 
                            src={saree.image} 
                            alt={saree.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-full h-full"
                            style={{ backgroundColor: saree.color }}
                          >
                            <div className="absolute inset-0 texture-silk opacity-50" />
                            <div className="absolute inset-0 texture-zari" />
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gold/40 to-transparent" />
                          </div>
                        )}
                        
                        {/* Selection indicator */}
                        {selectedSaree === saree.id && (
                          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-5 h-5 text-primary-foreground" />
                          </div>
                        )}
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div>
                            <h4 className="font-display font-semibold text-foreground">{saree.name}</h4>
                            <p className="text-muted-foreground text-xs capitalize">{saree.fabricType}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-card">
                        <h4 className="font-medium text-foreground text-sm truncate">{saree.name}</h4>
                        <p className="text-primary text-sm font-semibold">₹{saree.price.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Draping Style Selection */}
            <div className="space-y-6">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Draping Style
              </h2>
              <div className="space-y-3">
                {drapingStyles.map((style) => (
                  <Card
                    key={style.id}
                    variant={selectedStyle === style.id ? 'gold' : 'default'}
                    className={cn(
                      "cursor-pointer transition-all duration-300",
                      selectedStyle === style.id && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                          selectedStyle === style.id 
                            ? "border-primary bg-primary" 
                            : "border-muted-foreground"
                        )}>
                          {selectedStyle === style.id && (
                            <Check className="w-3 h-3 text-primary-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm">{style.name}</h4>
                          <p className="text-muted-foreground text-xs">{style.region}</p>
                          <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{style.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Continue Button */}
              <div className="space-y-3 pt-4">
                <Button 
                  variant="gold" 
                  size="lg" 
                  className="w-full"
                  onClick={handleContinue}
                  disabled={!selectedSaree}
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Try-On
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" className="w-full" onClick={onBack}>
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
