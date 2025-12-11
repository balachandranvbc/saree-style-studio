import { PoseLandmark } from '@/lib/poseDetection';

export interface Measurements {
  height: number;
  bust: number;
  waist: number;
  hips: number;
  shoulderWidth: number;
}

export interface PoseData {
  landmarks: PoseLandmark[];
  anchors: {
    leftShoulder: { x: number; y: number };
    rightShoulder: { x: number; y: number };
    leftHip: { x: number; y: number };
    rightHip: { x: number; y: number };
    waistCenter: { x: number; y: number };
    neckCenter: { x: number; y: number };
  };
  estimatedMeasurements: {
    shoulderWidth: number;
    torsoHeight: number;
    hipWidth: number;
    armLength: number;
    legLength: number;
  };
}

export interface Saree {
  id: string;
  name: string;
  subtitle?: string;
  color: string;
  secondaryColor?: string;
  fabricType: FabricType;
  image?: string;
  price: number;
  description: string;
  borderStyle?: string;
  pattern?: string;
}

export type FabricType = 
  | 'silk' 
  | 'cotton' 
  | 'georgette' 
  | 'chiffon' 
  | 'crepe'
  | 'organza'
  | 'banarasi'
  | 'kanjivaram'
  | 'chanderi';

export type DrapingStyle = 
  | 'nivi'
  | 'bengali'
  | 'gujarati'
  | 'maharashtrian'
  | 'tamil'
  | 'kerala'
  | 'lehenga'
  | 'hyderabadi'
  | 'coorgi'
  | 'bengali_lalpaar';

export interface DrapingStyleInfo {
  id: DrapingStyle;
  name: string;
  region: string;
  description: string;
  pleats: number;
  palluPosition: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  occasion?: string;
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

// 3D Avatar types for future Ready Player Me integration
export interface Avatar3DConfig {
  modelUrl?: string;
  textureUrl?: string;
  rigType: 'full-body' | 'half-body';
  lod: 'high' | 'medium' | 'low';
}

export interface ClothSimulationConfig {
  fabricWeight: number;
  stiffness: number;
  drapeCoefficient: number;
  collisionMargin: number;
  gravity: number;
}
