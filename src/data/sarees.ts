import { Saree, DrapingStyleInfo } from '@/types/tryon';
import sareePurple from '@/assets/saree-purple.jpg';
import sareeGold from '@/assets/saree-gold.jpg';
import sareePink from '@/assets/saree-pink.jpg';
import heroSaree from '@/assets/hero-saree.jpg';

export const sarees: Saree[] = [
  {
    id: 'silk-maroon',
    name: 'Kanchipuram Silk',
    color: '#8B0000',
    fabricType: 'silk',
    image: heroSaree,
    price: 25000,
    description: 'Traditional Kanchipuram silk with gold zari border'
  },
  {
    id: 'silk-gold',
    name: 'Banarasi Brocade',
    color: '#DAA520',
    fabricType: 'silk',
    image: sareeGold,
    price: 35000,
    description: 'Luxurious Banarasi with intricate brocade work'
  },
  {
    id: 'silk-royal',
    name: 'Mysore Silk',
    color: '#9932CC',
    fabricType: 'silk',
    image: sareePurple,
    price: 18000,
    description: 'Elegant Mysore silk with traditional motifs'
  },
  {
    id: 'georgette-pink',
    name: 'Designer Georgette',
    color: '#FF69B4',
    fabricType: 'georgette',
    image: sareePink,
    price: 12000,
    description: 'Flowing georgette with modern embroidery'
  },
  {
    id: 'cotton-blue',
    name: 'Handloom Cotton',
    color: '#1E3A5F',
    fabricType: 'cotton',
    image: '/placeholder.svg',
    price: 5000,
    description: 'Breathable handloom cotton with block prints'
  },
  {
    id: 'chiffon-emerald',
    name: 'Embroidered Chiffon',
    color: '#50C878',
    fabricType: 'chiffon',
    image: '/placeholder.svg',
    price: 15000,
    description: 'Lightweight chiffon with sequin work'
  }
];

export const drapingStyles: DrapingStyleInfo[] = [
  {
    id: 'nivi',
    name: 'Nivi Style',
    region: 'Andhra Pradesh',
    description: 'The most popular style with pleats at the front and pallu over the left shoulder',
    pleats: 7,
    palluPosition: 'Left shoulder'
  },
  {
    id: 'bengali',
    name: 'Bengali Style',
    region: 'West Bengal',
    description: 'No pleats with the pallu brought from the back over the right shoulder',
    pleats: 0,
    palluPosition: 'Right shoulder (key)'
  },
  {
    id: 'gujarati',
    name: 'Gujarati Style',
    region: 'Gujarat',
    description: 'Pallu is draped from the back to the front over the right shoulder',
    pleats: 5,
    palluPosition: 'Front display'
  },
  {
    id: 'maharashtrian',
    name: 'Nauvari Style',
    region: 'Maharashtra',
    description: 'Nine-yard saree draped in a dhoti-like fashion',
    pleats: 9,
    palluPosition: 'Tucked at waist'
  },
  {
    id: 'tamil',
    name: 'Madisar Style',
    region: 'Tamil Nadu',
    description: 'Traditional Brahmin style with V-shaped front drape',
    pleats: 8,
    palluPosition: 'Right shoulder'
  },
  {
    id: 'kerala',
    name: 'Kerala Kasavu',
    region: 'Kerala',
    description: 'Simple elegant drape with minimal pleats',
    pleats: 4,
    palluPosition: 'Left shoulder'
  }
];

export const fabricProperties = {
  silk: { weight: 0.8, stiffness: 0.7, drapeCoeff: 0.6 },
  cotton: { weight: 0.5, stiffness: 0.4, drapeCoeff: 0.5 },
  georgette: { weight: 0.3, stiffness: 0.2, drapeCoeff: 0.9 },
  chiffon: { weight: 0.2, stiffness: 0.15, drapeCoeff: 0.95 },
  crepe: { weight: 0.4, stiffness: 0.35, drapeCoeff: 0.7 }
};
