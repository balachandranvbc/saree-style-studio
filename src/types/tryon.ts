export interface Measurements {
  height: number;
  bust: number;
  waist: number;
  hips: number;
  shoulderWidth: number;
}

export interface Saree {
  id: string;
  name: string;
  color: string;
  fabricType: FabricType;
  image: string;
  price: number;
  description: string;
}

export type FabricType = 'silk' | 'cotton' | 'georgette' | 'chiffon' | 'crepe';

export type DrapingStyle = 
  | 'nivi'
  | 'bengali'
  | 'gujarati'
  | 'maharashtrian'
  | 'tamil'
  | 'kerala';

export interface DrapingStyleInfo {
  id: DrapingStyle;
  name: string;
  region: string;
  description: string;
  pleats: number;
  palluPosition: string;
}

export interface ProcessingState {
  step: 'idle' | 'uploading' | 'analyzing' | 'generating-avatar' | 'applying-drape' | 'rendering' | 'complete';
  progress: number;
  message: string;
}

export interface TryOnResult {
  imageUrl: string;
  avatarId: string;
  sareeId: string;
  drapingStyle: DrapingStyle;
  accuracy: number;
  timestamp: Date;
}
