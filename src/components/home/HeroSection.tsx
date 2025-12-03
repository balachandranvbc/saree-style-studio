import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Play, ArrowRight } from 'lucide-react';
import heroSaree from '@/assets/hero-saree.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-card">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A227' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered 3D Virtual Try-On
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-foreground">Experience</span>
              <br />
              <span className="bg-gradient-to-r from-gold-dark via-gold to-gold-light bg-clip-text text-transparent">
                Sarees Virtually
              </span>
              <br />
              <span className="text-foreground">Before You Buy</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
              Our revolutionary AI creates your 3D avatar and drapes authentic Indian sarees 
              with physics-based simulation. See how every fold, pleat, and pallu falls naturally.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/try-on">
                <Button variant="hero" size="xl" className="group">
                  Start Virtual Try-On
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="glass" size="xl" className="group">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <div className="text-center lg:text-left">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary">6</div>
                <div className="text-muted-foreground text-sm">Regional Styles</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary">98%</div>
                <div className="text-muted-foreground text-sm">Accuracy</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary">3D</div>
                <div className="text-muted-foreground text-sm">Physics Engine</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block animate-slide-in-right">
            {/* Main showcase card */}
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden border-2 border-primary/30 shadow-[0_0_60px_hsl(38_72%_50%/0.4)]">
              <img 
                src={heroSaree} 
                alt="Woman wearing elegant red and gold Kanchipuram silk saree in Nivi draping style" 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

              {/* Floating style badges */}
              <div className="absolute top-6 right-6 bg-card/80 backdrop-blur-md rounded-lg px-3 py-2 border border-border/50">
                <span className="text-sm font-medium text-primary">Nivi Style</span>
              </div>
              <div className="absolute bottom-6 left-6 bg-card/80 backdrop-blur-md rounded-lg px-3 py-2 border border-border/50">
                <span className="text-sm font-medium text-foreground">Kanchipuram Silk</span>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-2xl bg-gradient-to-br from-gold-dark to-gold rotate-12 shadow-[0_4px_30px_hsl(38_72%_50%/0.3)] animate-float" />
            <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-maroon-light -rotate-12 shadow-[0_8px_32px_hsl(0_0%_0%/0.4)] animate-float" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
