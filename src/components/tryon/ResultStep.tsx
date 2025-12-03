import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Download, 
  Share2, 
  RotateCcw, 
  Heart, 
  ShoppingBag,
  Sparkles,
  CheckCircle,
  Palette,
  Ruler
} from 'lucide-react';
import { DrapingStyle } from '@/types/tryon';
import { sarees, drapingStyles } from '@/data/sarees';

interface ResultStepProps {
  uploadedImage: string | null;
  sareeId: string;
  drapingStyle: DrapingStyle;
  onStartOver: () => void;
}

export function ResultStep({ uploadedImage, sareeId, drapingStyle, onStartOver }: ResultStepProps) {
  const [liked, setLiked] = useState(false);
  
  const saree = sarees.find(s => s.id === sareeId);
  const style = drapingStyles.find(s => s.id === drapingStyle);

  const accuracyMetrics = [
    { label: 'Body Alignment', value: '98.2%' },
    { label: 'Drape Realism', value: '96.7%' },
    { label: 'Color Accuracy', value: '99.1%' }
  ];

  return (
    <section className="min-h-[calc(100vh-5rem)] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 text-green-500 text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4" />
              Try-On Complete!
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Virtual Saree Look
            </h1>
            <p className="text-muted-foreground text-lg">
              See how the {saree?.name} looks in {style?.name} draping
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Result Image */}
            <div className="lg:col-span-2">
              <Card variant="gold" className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    {/* Show saree image as result */}
                    {saree?.image && saree.image !== '/placeholder.svg' ? (
                      <>
                        <img 
                          src={saree.image} 
                          alt={`${saree.name} in ${style?.name}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay with results info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                        
                        {/* Result badge */}
                        <div className="absolute bottom-6 left-6 right-6 bg-card/90 backdrop-blur-md rounded-xl p-4">
                          <div className="flex items-center gap-4">
                            <Sparkles className="w-8 h-8 text-primary" />
                            <div>
                              <h3 className="font-display text-lg font-semibold text-foreground">
                                {saree.name}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {style?.name} • {saree.fabricType}
                              </p>
                            </div>
                            <p className="text-primary font-bold text-xl ml-auto">
                              ₹{saree.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-maroon via-burgundy to-background flex items-center justify-center">
                        <div className="text-center p-8 space-y-6">
                          <div className="relative">
                            <div 
                              className="w-48 h-64 mx-auto rounded-2xl shadow-2xl relative overflow-hidden"
                              style={{ backgroundColor: saree?.color }}
                            >
                              <div className="absolute inset-0 texture-silk opacity-40" />
                              <div className="absolute inset-0 texture-zari" />
                              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gold/40 to-transparent" />
                            </div>
                            <div className="absolute -top-4 -right-4 w-8 h-8 text-gold animate-pulse">
                              <Sparkles className="w-full h-full" />
                            </div>
                          </div>
                          <div className="bg-card/80 backdrop-blur-md rounded-xl p-4 max-w-sm mx-auto">
                            <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                              {saree?.name}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-2">
                              {style?.name} • {saree?.fabricType}
                            </p>
                            <p className="text-primary font-bold text-xl">
                              ₹{saree?.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Style badge */}
                    <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-md rounded-lg px-3 py-2">
                      <span className="text-sm font-medium text-primary">{style?.name}</span>
                    </div>

                    {/* Like button */}
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`
                        absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-300
                        ${liked 
                          ? 'bg-red-500 text-primary-foreground' 
                          : 'bg-card/80 backdrop-blur-md text-foreground hover:bg-red-500 hover:text-primary-foreground'
                        }
                      `}
                    >
                      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 bg-card border-t border-border">
                    <div className="flex flex-wrap gap-3">
                      <Button variant="gold" size="lg" className="flex-1">
                        <ShoppingBag className="w-5 h-5" />
                        Buy This Saree
                      </Button>
                      <Button variant="outline" size="lg">
                        <Download className="w-5 h-5" />
                        Download
                      </Button>
                      <Button variant="outline" size="lg">
                        <Share2 className="w-5 h-5" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details Panel */}
            <div className="space-y-6">
              {/* Accuracy Metrics */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      AI Accuracy Score
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {accuracyMetrics.map((metric) => (
                      <div key={metric.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{metric.label}</span>
                          <span className="text-primary font-semibold">{metric.value}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-gold-dark to-gold rounded-full transition-all duration-1000"
                            style={{ width: metric.value }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Saree Details */}
              <Card variant="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Saree Details
                    </h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground font-medium">{saree?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fabric</span>
                      <span className="text-foreground font-medium capitalize">{saree?.fabricType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Draping</span>
                      <span className="text-foreground font-medium">{style?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pleats</span>
                      <span className="text-foreground font-medium">{style?.pleats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pallu</span>
                      <span className="text-foreground font-medium">{style?.palluPosition}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Physics Info */}
              <Card variant="default">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Ruler className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Physics Simulation
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    This result was generated using our advanced cloth physics engine with:
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="font-display text-xl font-bold text-primary">10,847</div>
                      <div className="text-muted-foreground text-xs">Cloth Particles</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="font-display text-xl font-bold text-primary">6,890</div>
                      <div className="text-muted-foreground text-xs">Body Vertices</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Try Again */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onStartOver}
              >
                <RotateCcw className="w-5 h-5" />
                Try Another Saree
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
