import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, Check, Sparkles, MapPin, Shirt, Star } from 'lucide-react';
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

  const selectedSareeData = sarees.find(s => s.id === selectedSaree);
  const selectedStyleData = drapingStyles.find(s => s.id === selectedStyle);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-600';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-600';
      case 'Hard': return 'bg-red-500/20 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-medium mb-4">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
              Step 3 of 4
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Choose Your Saree & Style
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select from 10 authentic regional draping styles and beautiful saree designs
            </p>
          </div>

          <Tabs defaultValue="styles" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="styles" className="gap-2">
                <Shirt className="w-4 h-4" />
                Draping Styles
              </TabsTrigger>
              <TabsTrigger value="sarees" className="gap-2">
                <Star className="w-4 h-4" />
                Saree Collection
              </TabsTrigger>
            </TabsList>

            {/* Draping Styles Tab */}
            <TabsContent value="styles" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drapingStyles.map((style) => (
                  <Card
                    key={style.id}
                    variant={selectedStyle === style.id ? 'gold' : 'elevated'}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-[1.02]",
                      selectedStyle === style.id && "ring-2 ring-primary shadow-lg"
                    )}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-display font-semibold text-foreground">{style.name}</h4>
                          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                            <MapPin className="w-3 h-3" />
                            {style.region}
                          </div>
                        </div>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                          selectedStyle === style.id 
                            ? "border-primary bg-primary" 
                            : "border-muted-foreground"
                        )}>
                          {selectedStyle === style.id && (
                            <Check className="w-4 h-4 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {style.description}
                      </p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {style.difficulty && (
                          <Badge variant="outline" className={getDifficultyColor(style.difficulty)}>
                            {style.difficulty}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {style.pleats} pleats
                        </Badge>
                      </div>
                      
                      {style.occasion && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Best for: {style.occasion}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Sarees Tab */}
            <TabsContent value="sarees" className="space-y-6">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {sarees.map((saree) => (
                  <Card
                    key={saree.id}
                    variant={selectedSaree === saree.id ? 'gold' : 'elevated'}
                    className={cn(
                      "cursor-pointer overflow-hidden group transition-all duration-300 hover:scale-[1.02]",
                      selectedSaree === saree.id && "ring-2 ring-primary shadow-lg"
                    )}
                    onClick={() => setSelectedSaree(saree.id)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-[3/4] relative overflow-hidden">
                        {saree.image && !saree.image.includes('placeholder') ? (
                          <img 
                            src={saree.image} 
                            alt={saree.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div 
                            className="w-full h-full relative"
                            style={{ backgroundColor: saree.color }}
                          >
                            {/* Fabric texture overlay */}
                            <div className="absolute inset-0 opacity-30" 
                              style={{
                                backgroundImage: `repeating-linear-gradient(
                                  45deg,
                                  transparent,
                                  transparent 2px,
                                  rgba(255,255,255,0.1) 2px,
                                  rgba(255,255,255,0.1) 4px
                                )`
                              }}
                            />
                            {/* Border simulation */}
                            {saree.secondaryColor && (
                              <div 
                                className="absolute bottom-0 left-0 right-0 h-12"
                                style={{ 
                                  background: `linear-gradient(to top, ${saree.secondaryColor}, transparent)` 
                                }}
                              />
                            )}
                          </div>
                        )}
                        
                        {/* Selection indicator */}
                        {selectedSaree === saree.id && (
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <div>
                            <p className="text-foreground text-xs font-medium line-clamp-2">{saree.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-card">
                        <h4 className="font-medium text-foreground text-sm truncate">{saree.name}</h4>
                        {saree.subtitle && (
                          <p className="text-muted-foreground text-xs truncate">{saree.subtitle}</p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-primary text-sm font-semibold">₹{saree.price.toLocaleString()}</p>
                          <Badge variant="outline" className="text-xs capitalize">
                            {saree.fabricType}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Selection Summary & Actions */}
          <Card className="mt-8 p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Summary */}
              <div className="flex-1 space-y-2">
                <h3 className="font-display font-semibold text-foreground">Your Selection</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-border"
                      style={{ backgroundColor: selectedSareeData?.color || '#ccc' }}
                    />
                    <span className="text-sm text-foreground">
                      {selectedSareeData?.name || 'Select a saree'}
                    </span>
                  </div>
                  <span className="text-muted-foreground">+</span>
                  <span className="text-sm text-foreground">
                    {selectedStyleData?.name || 'Nivi Style'}
                  </span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button 
                  variant="gold" 
                  size="lg"
                  onClick={handleContinue}
                  disabled={!selectedSaree}
                  className="min-w-[180px]"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Try-On
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
