import { Saree, DrapingStyleInfo } from '@/types/tryon';
import sareePurple from '@/assets/saree-purple.jpg';
import sareeGold from '@/assets/saree-gold.jpg';
import sareePink from '@/assets/saree-pink.jpg';
import heroSaree from '@/assets/hero-saree.jpg';

// 10 Regional Draping Styles
export const drapingStyles: DrapingStyleInfo[] = [
  {
    id: 'nivi',
    name: 'Modern Nivi Style',
    region: 'Andhra Pradesh',
    description: 'Most common Indian drape - pleated front tucked at waist center + over-shoulder pallu. Clean, elegant, versatile.',
    pleats: 7,
    palluPosition: 'Left shoulder',
    difficulty: 'Easy',
    occasion: 'Everyday, Office, Casual'
  },
  {
    id: 'bengali',
    name: 'Bengali Style',
    region: 'West Bengal',
    description: 'No front pleats, heavy pallu wrapping over right shoulder with signature key-hole drape. Traditional Kolkata elegance.',
    pleats: 0,
    palluPosition: 'Right shoulder (key)',
    difficulty: 'Medium',
    occasion: 'Pujas, Weddings, Festivals'
  },
  {
    id: 'gujarati',
    name: 'Gujarati Seedha Pallu',
    region: 'Gujarat',
    description: 'Pallu comes over front with diagonal fall from right shoulder. Showcases pallu design beautifully.',
    pleats: 5,
    palluPosition: 'Front display',
    difficulty: 'Medium',
    occasion: 'Garba, Weddings, Festivals'
  },
  {
    id: 'tamil',
    name: 'Tamil Nadu Madisar',
    region: 'Tamil Nadu',
    description: 'Traditional wrap with structured pleats and long pallu. V-shaped front drape, worn for rituals.',
    pleats: 8,
    palluPosition: 'Right shoulder',
    difficulty: 'Hard',
    occasion: 'Religious, Traditional'
  },
  {
    id: 'kerala',
    name: 'Kerala Kasavu (Mundum Neriyathum)',
    region: 'Kerala',
    description: 'White-gold border with simple, elegant two-piece drape. Symbol of Kerala tradition.',
    pleats: 4,
    palluPosition: 'Left shoulder',
    difficulty: 'Easy',
    occasion: 'Onam, Vishu, Temple'
  },
  {
    id: 'maharashtrian',
    name: 'Maharashtrian Nauvari',
    region: 'Maharashtra',
    description: '9-yard saree worn like dhoti - tucked behind, perfect for movement. Powerful traditional style.',
    pleats: 9,
    palluPosition: 'Tucked at waist',
    difficulty: 'Hard',
    occasion: 'Weddings, Lavani Dance'
  },
  {
    id: 'lehenga',
    name: 'Lehenga Style Saree',
    region: 'Modern/Fusion',
    description: 'Full circular pleats like lehenga + decorative pinned pallu. Contemporary bridal favorite.',
    pleats: 12,
    palluPosition: 'Pinned at shoulder',
    difficulty: 'Medium',
    occasion: 'Weddings, Receptions, Parties'
  },
  {
    id: 'hyderabadi',
    name: 'Hyderabadi Khada Dupatta',
    region: 'Hyderabad',
    description: 'Regal draping with standing pleats and dupatta-style pallu. Nawabi elegance.',
    pleats: 6,
    palluPosition: 'Both shoulders',
    difficulty: 'Hard',
    occasion: 'Royal Events, Weddings'
  },
  {
    id: 'coorgi',
    name: 'Coorgi Style',
    region: 'Karnataka (Coorg)',
    description: 'Pleats at the back, pallu wrapped tightly around shoulder. Unique back-pleated style.',
    pleats: 5,
    palluPosition: 'Right shoulder (tight)',
    difficulty: 'Medium',
    occasion: 'Coorgi Weddings, Cultural'
  },
  {
    id: 'bengali_lalpaar',
    name: 'Bengali Lal Paar',
    region: 'West Bengal',
    description: 'Red border festive variant with white base. Symbol of Bengali married women during Durga Puja.',
    pleats: 0,
    palluPosition: 'Right shoulder (key)',
    difficulty: 'Medium',
    occasion: 'Durga Puja, Sindoor Khela'
  }
];

// 10 Saree Designs with Real Names
export const sarees: Saree[] = [
  {
    id: 'kanjivaram-royal',
    name: 'Kanjeevaram Silk Saree',
    subtitle: 'Royal Gold & Maroon',
    color: '#8B0000',
    secondaryColor: '#DAA520',
    fabricType: 'kanjivaram',
    image: heroSaree,
    price: 45000,
    description: 'Heavy pure silk with real gold zari, temple border motifs',
    borderStyle: 'Temple border with peacock motifs',
    pattern: 'Traditional checks with mango buttas'
  },
  {
    id: 'banarasi-brocade',
    name: 'Banarasi Silk Saree',
    subtitle: 'Zari Brocade Pattern',
    color: '#DAA520',
    secondaryColor: '#8B0000',
    fabricType: 'banarasi',
    image: sareeGold,
    price: 55000,
    description: 'Luxurious Banarasi with intricate brocade zari work',
    borderStyle: 'Heavy meenakari border',
    pattern: 'Mughal jaal with floral motifs'
  },
  {
    id: 'organza-pastel',
    name: 'Soft Organza Saree',
    subtitle: 'Pastel Floral Design',
    color: '#FFB6C1',
    secondaryColor: '#98FB98',
    fabricType: 'organza',
    image: sareePink,
    price: 18000,
    description: 'Sheer organza with delicate floral prints',
    borderStyle: 'Thin thread work border',
    pattern: 'Digital floral prints'
  },
  {
    id: 'georgette-sequin',
    name: 'Georgette Saree',
    subtitle: 'Sequins Party Wear',
    color: '#9932CC',
    secondaryColor: '#C0C0C0',
    fabricType: 'georgette',
    image: sareePurple,
    price: 22000,
    description: 'Flowing georgette with all-over sequin embroidery',
    borderStyle: 'Crystal stone border',
    pattern: 'Scattered sequin work'
  },
  {
    id: 'chiffon-plain',
    name: 'Chiffon Saree',
    subtitle: 'Plain Lightweight Draping',
    color: '#FF69B4',
    fabricType: 'chiffon',
    price: 8000,
    description: 'Pure chiffon with minimal border, perfect for easy draping',
    borderStyle: 'Thin satin border',
    pattern: 'Plain with subtle shimmer'
  },
  {
    id: 'cotton-daily',
    name: 'Cotton Saree',
    subtitle: 'Simple Daily Wear',
    color: '#4169E1',
    secondaryColor: '#FFFFFF',
    fabricType: 'cotton',
    price: 3500,
    description: 'Soft handloom cotton, perfect for everyday comfort',
    borderStyle: 'Contrast woven border',
    pattern: 'Traditional checks'
  },
  {
    id: 'satin-evening',
    name: 'Satin Saree',
    subtitle: 'Glossy Evening Wear',
    color: '#000080',
    secondaryColor: '#FFD700',
    fabricType: 'silk',
    price: 15000,
    description: 'Glossy satin with rich drape for evening events',
    borderStyle: 'Gold beadwork border',
    pattern: 'Plain with luxury sheen'
  },
  {
    id: 'crepe-printed',
    name: 'Printed Crepe Saree',
    subtitle: 'Trendy Digital Print',
    color: '#228B22',
    secondaryColor: '#FFD700',
    fabricType: 'georgette',
    price: 12000,
    description: 'Crepe georgette with modern digital prints',
    borderStyle: 'Printed border',
    pattern: 'Abstract geometric prints'
  },
  {
    id: 'kerala-kasavu',
    name: 'Kerala Kasavu Saree',
    subtitle: 'White-Gold Temple Style',
    color: '#FFFFF0',
    secondaryColor: '#DAA520',
    fabricType: 'cotton',
    price: 6000,
    description: 'Traditional off-white with authentic golden zari border',
    borderStyle: 'Temple gold border',
    pattern: 'Plain with golden tissue pallu'
  },
  {
    id: 'net-designer',
    name: 'Designer Net Saree',
    subtitle: 'Fancy Embroidered Look',
    color: '#DC143C',
    secondaryColor: '#FFD700',
    fabricType: 'organza',
    price: 28000,
    description: 'Heavy embroidered net with stone work throughout',
    borderStyle: 'Heavy embroidered border',
    pattern: 'All-over thread and stone embroidery'
  }
];

// Fabric properties for realistic rendering
export const fabricProperties: Record<string, { 
  weight: number; 
  stiffness: number; 
  drapeCoeff: number; 
  sheen: number;
  transparency: number;
}> = {
  silk: { weight: 0.8, stiffness: 0.7, drapeCoeff: 0.6, sheen: 0.8, transparency: 0 },
  cotton: { weight: 0.5, stiffness: 0.4, drapeCoeff: 0.5, sheen: 0.1, transparency: 0 },
  organza: { weight: 0.2, stiffness: 0.3, drapeCoeff: 0.85, sheen: 0.6, transparency: 0.7 },
  georgette: { weight: 0.3, stiffness: 0.2, drapeCoeff: 0.9, sheen: 0.3, transparency: 0.2 },
  chiffon: { weight: 0.2, stiffness: 0.15, drapeCoeff: 0.95, sheen: 0.2, transparency: 0.4 },
  banarasi: { weight: 0.9, stiffness: 0.8, drapeCoeff: 0.4, sheen: 0.9, transparency: 0 },
  kanjivaram: { weight: 0.95, stiffness: 0.85, drapeCoeff: 0.35, sheen: 0.95, transparency: 0 },
  chanderi: { weight: 0.35, stiffness: 0.3, drapeCoeff: 0.75, sheen: 0.5, transparency: 0.3 },
  crepe: { weight: 0.4, stiffness: 0.35, drapeCoeff: 0.7, sheen: 0.2, transparency: 0 }
};

// Color palette for sarees
export const sareeColors = [
  { name: 'Maroon', hex: '#8B0000' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Emerald Green', hex: '#50C878' },
  { name: 'Golden Yellow', hex: '#DAA520' },
  { name: 'Purple', hex: '#9932CC' },
  { name: 'Pink', hex: '#FF69B4' },
  { name: 'Navy Blue', hex: '#000080' },
  { name: 'Orange', hex: '#FF6347' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Wine', hex: '#722F37' }
];
