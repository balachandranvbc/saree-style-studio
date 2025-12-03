import { drapingStyles } from '@/data/sarees';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export function DrapingStylesSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-medium text-sm tracking-wider uppercase mb-4">
            Cultural Heritage
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            <span className="bg-gradient-to-r from-gold-dark via-gold to-gold-light bg-clip-text text-transparent">
              6 Regional
            </span>{' '}
            Draping Styles
          </h2>
          <p className="text-muted-foreground text-lg">
            Each region of India has developed unique ways to drape the saree. 
            Our AI understands and recreates each style with authentic precision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drapingStyles.map((style, index) => (
            <Card 
              key={style.id}
              variant="gold"
              className="group overflow-hidden"
            >
              <CardContent className="p-0">
                {/* Header with color gradient */}
                <div className="h-32 bg-gradient-to-br from-maroon via-burgundy to-background relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-display text-4xl font-bold text-primary/30">
                        {style.pleats}
                      </div>
                      <div className="text-foreground/50 text-xs uppercase tracking-wider">
                        Pleats
                      </div>
                    </div>
                  </div>
                  {/* Region badge */}
                  <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-foreground">{style.region}</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {style.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {style.description}
                  </p>
                  <div className="pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pallu Position</span>
                      <span className="text-primary font-medium">{style.palluPosition}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
