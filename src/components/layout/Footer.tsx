import { Link } from 'react-router-dom';
import { Sparkles, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-dark via-gold to-gold-light flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold bg-gradient-to-r from-gold-dark via-gold to-gold-light bg-clip-text text-transparent">
                SareeTryOn
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              AI-powered 3D virtual try-on for authentic Indian sarees. Experience the future of saree shopping.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/try-on" className="text-muted-foreground hover:text-primary text-sm transition-colors">Virtual Try-On</Link></li>
              <li><Link to="/catalog" className="text-muted-foreground hover:text-primary text-sm transition-colors">Saree Catalog</Link></li>
              <li><Link to="/how-it-works" className="text-muted-foreground hover:text-primary text-sm transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Draping Styles */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Draping Styles</h4>
            <ul className="space-y-2">
              <li><span className="text-muted-foreground text-sm">Nivi (Andhra)</span></li>
              <li><span className="text-muted-foreground text-sm">Bengali Style</span></li>
              <li><span className="text-muted-foreground text-sm">Gujarati Style</span></li>
              <li><span className="text-muted-foreground text-sm">Nauvari (Maharashtra)</span></li>
              <li><span className="text-muted-foreground text-sm">Madisar (Tamil)</span></li>
              <li><span className="text-muted-foreground text-sm">Kerala Kasavu</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Technology</h4>
            <ul className="space-y-2">
              <li><span className="text-muted-foreground text-sm">3D Avatar Generation</span></li>
              <li><span className="text-muted-foreground text-sm">Physics-Based Draping</span></li>
              <li><span className="text-muted-foreground text-sm">SMPL Body Model</span></li>
              <li><span className="text-muted-foreground text-sm">Real-time Rendering</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 SareeTryOn. Powered by AI & 3D Technology.
          </p>
        </div>
      </div>
    </footer>
  );
}
