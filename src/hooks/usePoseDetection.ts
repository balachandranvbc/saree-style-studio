import { useState, useCallback } from 'react';
import { 
  detectPose, 
  calculateMeasurementsFromPose, 
  getAnchorPointsFromPose,
  PoseResult,
  PoseLandmark 
} from '@/lib/poseDetection';

interface UsePoseDetectionResult {
  isDetecting: boolean;
  poseResult: PoseResult | null;
  error: string | null;
  detectFromImage: (imageUrl: string) => Promise<{
    landmarks: PoseLandmark[];
    measurements: ReturnType<typeof calculateMeasurementsFromPose>;
    anchors: ReturnType<typeof getAnchorPointsFromPose>;
  } | null>;
}

export function usePoseDetection(): UsePoseDetectionResult {
  const [isDetecting, setIsDetecting] = useState(false);
  const [poseResult, setPoseResult] = useState<PoseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectFromImage = useCallback(async (imageUrl: string) => {
    setIsDetecting(true);
    setError(null);
    
    try {
      // Create image element
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
      });

      console.log('Image loaded, detecting pose...', img.width, img.height);
      
      const result = await detectPose(img);
      
      if (result) {
        setPoseResult(result);
        
        const measurements = calculateMeasurementsFromPose(
          result.landmarks,
          img.width,
          img.height
        );
        
        const anchors = getAnchorPointsFromPose(
          result.landmarks,
          img.width,
          img.height
        );

        console.log('Pose detected successfully:', {
          landmarkCount: result.landmarks.length,
          measurements,
          anchors
        });

        return {
          landmarks: result.landmarks,
          measurements,
          anchors,
        };
      } else {
        setError('No pose detected in the image. Please upload a clear full-body photo.');
        return null;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Pose detection failed';
      setError(message);
      console.error('Pose detection error:', err);
      return null;
    } finally {
      setIsDetecting(false);
    }
  }, []);

  return {
    isDetecting,
    poseResult,
    error,
    detectFromImage,
  };
}
