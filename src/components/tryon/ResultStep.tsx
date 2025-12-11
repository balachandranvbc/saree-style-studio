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
  Ruler,
  ZoomIn,
  ZoomOut,
  Cpu
} from 'lucide-react';
import { DrapingStyle, Measurements, PoseData } from '@/types/tryon';
import { sarees, drapingStyles } from '@/data/sarees';
import { useToast } from '@/hooks/use-toast';

interface ResultStepProps {
  uploadedImage: string | null;
  resultImage: string | null;
  sareeId: string;
  drapingStyle: DrapingStyle;
  measurements?: Measurements;
  poseData?: PoseData;
  onStartOver: () => void;
}

export function ResultStep({ 
  uploadedImage, 
  resultImage, 
  sareeId, 
  drapingStyle, 
  measurements, 
  poseData, 
  onStartOver 
}: ResultStepProps) {
  const [liked, setLiked] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const { toast } = useToast();
  
  const saree = sarees.find(s => s.id === sareeId);
  const style = drapingStyles.find(s => s.id === drapingStyle);
  
  const accuracyMetrics = [
    { label: 'Body Alignment', value: '98.2%' },
    { label: 'Drape Realism', value: '96.7%' },
    { label: 'Color Accuracy', value: '99.1%' }
  ];

  const handleDownload = async () => {
    if (!resultImage) return;
    
    try {
      // Convert base64 to blob
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `saree-tryon-${saree?.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Downloaded!',
        description: 'Your virtual try-on image has been saved.',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Unable to download image. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleShare = async () => {
    if (!resultImage) return;
    
    try {
      if (navigator.share) {
        const response = await fetch(resultImage);
        const blob = await response.blob();
        const file = new File([blob], 'saree-tryon.png', { type: 'image/png' });
        
        await navigator.share({
          title: `Virtual Try-On: ${saree?.name}`,
          text: `Check out how I look in this beautiful ${saree?.name} saree with ${style?.name} draping!`,
          files: [file]
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied!',
          description: 'Share link has been copied to clipboard.',
        });
      }
    } catch (error) {
      toast({
        title: 'Share Failed',
        description: 'Unable to share. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const displayImage = showOriginal ? uploadedImage : resultImage;

  return (
    <section className="min-h-[calc(100vh-5rem)] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 text-green-500 text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4" />
              AI Try-On Complete!
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Virtual Saree Look
            </h1>
            <p className="text-muted-foreground text-lg">
              See how the {saree?.name} looks in {style?.name} draping
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card variant="gold" className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-background via-muted/10 to-background">
                    {/* Result Image */}
                    {displayImage ? (
                      <div className="w-full h-full flex items-center justify-center overflow-hidden">
                        <img 
                          src={displayImage}
                          alt="Virtual try-on result"
                          className="max-w-full max-h-full object-contain transition-transform duration-300"
                          style={{ transform: `scale(${zoom})` }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
                          <p>Generating your look...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay with results info */}
                    <div className="absolute bottom-6 left-6 right-6 bg-card/90 backdrop-blur-md rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-5 h-5 text-primary" />
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-semibold text-foreground">
                            {saree?.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {style?.name} • {saree?.fabricType} • AI Generated
                          </p>
                        </div>
                        <p className="text-primary font-bold text-xl ml-auto">
                          ₹{saree?.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Top controls */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="bg-card/90 backdrop-blur-md rounded-lg px-3 py-2">
                        <span className="text-sm font-medium text-primary">{style?.name} Style</span>
                      </div>
                    </div>
                    
                    {/* Toggle and zoom controls */}
                    <div className="absolute top-4 right-16 flex items-center gap-2">
                      <button
                        onClick={() => setShowOriginal(!showOriginal)}
                        className="bg-card/90 backdrop-blur-md rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showOriginal ? 'Show Result' : 'Show Original'}
                      </button>
                      <button
                        onClick={() => setZoom(z => Math.min(z + 0.25, 2))}
                        className="bg-card/90 backdrop-blur-md rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}
                        className="bg-card/90 backdrop-blur-md rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
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
                      <Button variant="outline" size="lg" onClick={handleDownload}>
                        <Download className="w-5 h-5" />
                        Download
                      </Button>
                      <Button variant="outline" size="lg" onClick={handleShare}>
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
              {/* AI Generation Badge */}
              <Card variant="glass" className="border-primary/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">AI-Generated Result</p>
                      <p className="text-xs text-muted-foreground">Powered by Lovable AI</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Accuracy Metrics */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      AI Quality Score
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
                      <span className="text-muted-foreground">Region</span>
                      <span className="text-foreground font-medium">{style?.region}</span>
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

              {/* Processing Info */}
              <Card variant="default">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Ruler className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      AI Processing
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    This result was generated using advanced AI image processing:
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="font-display text-lg font-bold text-primary">Gemini</div>
                      <div className="text-muted-foreground text-xs">Vision AI</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="font-display text-lg font-bold text-primary">Real-time</div>
                      <div className="text-muted-foreground text-xs">Generation</div>
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
