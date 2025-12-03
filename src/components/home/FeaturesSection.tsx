import { Card, CardContent } from '@/components/ui/card';
import { 
  Camera, 
  User, 
  Palette, 
  Sparkles, 
  Ruler,
  Layers
} from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: 'Photo-Based Avatar',
    description: 'Upload a single photo and our AI generates an accurate 3D model of your body with 6890 vertices.',
    gradient: 'from-gold-dark to-gold'
  },
  {
    icon: User,
    title: 'SMPL Body Model',
    description: 'Industry-standard parametric body model with 23 joints and 10 shape parameters for realistic avatars.',
    gradient: 'from-secondary to-maroon-light'
  },
  {
    icon: Layers,
    title: 'Physics Simulation',
    description: '10,000+ particle cloth simulation with Position-Based Dynamics for authentic saree draping.',
    gradient: 'from-accent to-royal'
  },
  {
    icon: Palette,
    title: '6 Regional Styles',
    description: 'From Nivi to Nauvari, experience authentic draping styles from across India.',
    gradient: 'from-gold to-gold-light'
  },
  {
    icon: Sparkles,
    title: 'Fabric Physics',
    description: 'Real fabric properties - silk stiffness, chiffon flow, cotton weight - all simulated accurately.',
    gradient: 'from-maroon to-burgundy'
  },
  {
    icon: Ruler,
    title: '< 2cm Accuracy',
    description: 'Scientific accuracy metrics ensure shoulder, waist, and hip alignment within 2cm RMSE.',
    gradient: 'from-royal to-accent'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-medium text-sm tracking-wider uppercase mb-4">
            Advanced Technology
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Powered by{' '}
            <span className="bg-gradient-to-r from-gold-dark via-gold to-gold-light bg-clip-text text-transparent">
              AI & 3D Physics
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our system combines cutting-edge computer vision with physics-based simulation 
            to deliver the most realistic virtual saree try-on experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              variant="elevated"
              className="group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
