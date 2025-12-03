import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  Ruler, 
  Palette, 
  Sparkles, 
  ArrowRight,
  Layers,
  Cpu,
  Zap,
  Shield
} from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: Upload,
    title: 'Upload Your Photo',
    description: 'Take a full-body photo or upload an existing one. Our AI works best with front-facing images in good lighting.',
    features: ['Any smartphone camera', 'Auto lighting adjustment', 'Instant processing']
  },
  {
    step: 2,
    icon: Ruler,
    title: 'AI Measures Your Body',
    description: 'Our SMPL-based model extracts precise body measurements from your photo, creating a 3D mesh with 6,890 vertices.',
    features: ['< 2cm accuracy', '23 body joints', '10 shape parameters']
  },
  {
    step: 3,
    icon: Palette,
    title: 'Choose Your Saree',
    description: 'Browse our collection of authentic sarees and select your preferred regional draping style from 6 options.',
    features: ['6 regional styles', '5 fabric types', 'Authentic designs']
  },
  {
    step: 4,
    icon: Sparkles,
    title: 'Physics Simulation',
    description: 'Our cloth engine simulates 10,000+ particles to drape the saree naturally on your avatar with realistic folds.',
    features: ['Position-Based Dynamics', 'Collision detection', 'Fabric physics']
  }
];

const techFeatures = [
  {
    icon: Cpu,
    title: 'SMPL Body Model',
    description: 'Industry-standard parametric body model used by Meta, Google, and research institutions worldwide.'
  },
  {
    icon: Layers,
    title: 'Real-Time Rendering',
    description: 'GPU-accelerated rendering delivers results in seconds, not minutes.'
  },
  {
    icon: Zap,
    title: 'Edge Computing',
    description: 'Processing happens close to you for minimal latency and instant results.'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your photos are never stored. All processing is done in real-time and deleted after.'
  }
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        {/* Hero */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                How Our{' '}
                <span className="bg-gradient-to-r from-gold-dark via-gold to-gold-light bg-clip-text text-transparent">
                  AI Technology
                </span>{' '}
                Works
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl">
                Go from photo to perfectly draped saree in 4 simple steps, powered by 
                cutting-edge AI and physics simulation.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6">
              {steps.map((item, index) => (
                <Card 
                  key={item.step}
                  variant="elevated"
                  className="relative overflow-hidden group"
                >
                  <CardContent className="p-6">
                    {/* Step number */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full" />
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <item.icon className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <div className="text-6xl font-display font-bold text-primary/10 absolute top-0 right-0">
                        {item.step}
                      </div>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {item.description}
                      </p>
                      <ul className="space-y-2">
                        {item.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block text-primary font-medium text-sm tracking-wider uppercase mb-4">
                Under the Hood
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Enterprise-Grade Technology
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {techFeatures.map((feature) => (
                <Card key={feature.title} variant="glass">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card variant="gold" className="overflow-hidden">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Ready to Experience the Magic?
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                  See for yourself how our AI transforms the way you shop for sarees.
                  It's free to try!
                </p>
                <Link to="/try-on">
                  <Button variant="hero" size="xl" className="group">
                    Start Your Virtual Try-On
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
