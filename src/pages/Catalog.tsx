import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sarees } from '@/data/sarees';
import { Filter, Grid3X3, LayoutGrid, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const fabricFilters = ['all', 'silk', 'cotton', 'georgette', 'chiffon', 'crepe'];

const Catalog = () => {
  const [selectedFabric, setSelectedFabric] = useState('all');
  const [gridSize, setGridSize] = useState<'small' | 'large'>('large');

  const filteredSarees = selectedFabric === 'all' 
    ? sarees 
    : sarees.filter(s => s.fabricType === selectedFabric);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Saree{' '}
              <span className="bg-gradient-to-r from-gold-dark via-gold to-gold-light bg-clip-text text-transparent">
                Collection
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Browse our curated collection of authentic Indian sarees, each available for virtual try-on
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              {fabricFilters.map((fabric) => (
                <button
                  key={fabric}
                  onClick={() => setSelectedFabric(fabric)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize",
                    selectedFabric === fabric
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {fabric}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGridSize('large')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  gridSize === 'large' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setGridSize('small')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  gridSize === 'small' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className={cn(
            "grid gap-6",
            gridSize === 'large' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          )}>
            {filteredSarees.map((saree) => (
              <Card 
                key={saree.id}
                variant="elevated"
                className="group overflow-hidden"
              >
                <CardContent className="p-0">
                  <div 
                    className={cn(
                      "relative overflow-hidden",
                      gridSize === 'large' ? "aspect-[3/4]" : "aspect-square"
                    )}
                  >
                    {saree.image && saree.image !== '/placeholder.svg' ? (
                      <img 
                        src={saree.image} 
                        alt={saree.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div 
                        className="w-full h-full"
                        style={{ backgroundColor: saree.color }}
                      >
                        {/* Fabric texture */}
                        <div className="absolute inset-0 texture-silk opacity-50" />
                        <div className="absolute inset-0 texture-zari" />
                        {/* Golden border */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gold/30 to-transparent" />
                      </div>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <Link to="/try-on">
                        <Button variant="gold">
                          <Sparkles className="w-4 h-4" />
                          Try On
                        </Button>
                      </Link>
                    </div>

                    {/* Fabric badge */}
                    <div className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-xs font-medium text-foreground capitalize">{saree.fabricType}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {saree.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{saree.description}</p>
                    <p className="text-primary font-bold text-lg">₹{saree.price.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty state */}
          {filteredSarees.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No sarees found for this filter.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSelectedFabric('all')}
              >
                Show All Sarees
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;
