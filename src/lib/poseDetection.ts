import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface PoseResult {
  landmarks: PoseLandmark[];
  worldLandmarks: PoseLandmark[];
  segmentationMask?: ImageData;
}

// MediaPipe Pose landmark indices
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

let poseLandmarker: PoseLandmarker | null = null;
let isInitializing = false;

export async function initPoseDetection(): Promise<PoseLandmarker> {
  if (poseLandmarker) return poseLandmarker;
  if (isInitializing) {
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (poseLandmarker) return poseLandmarker;
  }

  isInitializing = true;
  
  try {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task',
        delegate: 'GPU'
      },
      runningMode: 'IMAGE',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
      outputSegmentationMasks: false
    });

    console.log('MediaPipe Pose Landmarker initialized successfully');
    return poseLandmarker;
  } catch (error) {
    console.error('Failed to initialize pose detection:', error);
    throw error;
  } finally {
    isInitializing = false;
  }
}

export async function detectPose(imageElement: HTMLImageElement): Promise<PoseResult | null> {
  const landmarker = await initPoseDetection();
  
  try {
    const result = landmarker.detect(imageElement);
    
    if (result.landmarks && result.landmarks.length > 0) {
      return {
        landmarks: result.landmarks[0],
        worldLandmarks: result.worldLandmarks?.[0] || result.landmarks[0],
      };
    }
    
    return null;
  } catch (error) {
    console.error('Pose detection failed:', error);
    return null;
  }
}

export function calculateMeasurementsFromPose(
  landmarks: PoseLandmark[],
  imageWidth: number,
  imageHeight: number
): {
  shoulderWidth: number;
  torsoHeight: number;
  hipWidth: number;
  armLength: number;
  legLength: number;
} {
  const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
  const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
  const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
  const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
  const leftElbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
  const leftWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
  const leftKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
  const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];

  // Calculate distances in pixel space
  const shoulderWidthPx = Math.sqrt(
    Math.pow((rightShoulder.x - leftShoulder.x) * imageWidth, 2) +
    Math.pow((rightShoulder.y - leftShoulder.y) * imageHeight, 2)
  );

  const hipWidthPx = Math.sqrt(
    Math.pow((rightHip.x - leftHip.x) * imageWidth, 2) +
    Math.pow((rightHip.y - leftHip.y) * imageHeight, 2)
  );

  const midShoulder = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
  };
  const midHip = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2,
  };

  const torsoHeightPx = Math.sqrt(
    Math.pow((midHip.x - midShoulder.x) * imageWidth, 2) +
    Math.pow((midHip.y - midShoulder.y) * imageHeight, 2)
  );

  const upperArmPx = Math.sqrt(
    Math.pow((leftElbow.x - leftShoulder.x) * imageWidth, 2) +
    Math.pow((leftElbow.y - leftShoulder.y) * imageHeight, 2)
  );
  const lowerArmPx = Math.sqrt(
    Math.pow((leftWrist.x - leftElbow.x) * imageWidth, 2) +
    Math.pow((leftWrist.y - leftElbow.y) * imageHeight, 2)
  );
  const armLengthPx = upperArmPx + lowerArmPx;

  const upperLegPx = Math.sqrt(
    Math.pow((leftKnee.x - leftHip.x) * imageWidth, 2) +
    Math.pow((leftKnee.y - leftHip.y) * imageHeight, 2)
  );
  const lowerLegPx = Math.sqrt(
    Math.pow((leftAnkle.x - leftKnee.x) * imageWidth, 2) +
    Math.pow((leftAnkle.y - leftKnee.y) * imageHeight, 2)
  );
  const legLengthPx = upperLegPx + lowerLegPx;

  // Convert to approximate cm (assuming average proportions)
  // Using shoulder width as reference (average ~40cm)
  const scale = 40 / shoulderWidthPx;

  return {
    shoulderWidth: Math.round(shoulderWidthPx * scale),
    torsoHeight: Math.round(torsoHeightPx * scale),
    hipWidth: Math.round(hipWidthPx * scale),
    armLength: Math.round(armLengthPx * scale),
    legLength: Math.round(legLengthPx * scale),
  };
}

export function getAnchorPointsFromPose(
  landmarks: PoseLandmark[],
  imageWidth: number,
  imageHeight: number
): {
  leftShoulder: { x: number; y: number };
  rightShoulder: { x: number; y: number };
  leftHip: { x: number; y: number };
  rightHip: { x: number; y: number };
  waistCenter: { x: number; y: number };
  neckCenter: { x: number; y: number };
} {
  const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
  const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
  const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
  const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];

  return {
    leftShoulder: {
      x: leftShoulder.x * imageWidth,
      y: leftShoulder.y * imageHeight,
    },
    rightShoulder: {
      x: rightShoulder.x * imageWidth,
      y: rightShoulder.y * imageHeight,
    },
    leftHip: {
      x: leftHip.x * imageWidth,
      y: leftHip.y * imageHeight,
    },
    rightHip: {
      x: rightHip.x * imageWidth,
      y: rightHip.y * imageHeight,
    },
    waistCenter: {
      x: ((leftHip.x + rightHip.x) / 2) * imageWidth,
      y: (((leftHip.y + rightHip.y) / 2) - 0.05) * imageHeight,
    },
    neckCenter: {
      x: ((leftShoulder.x + rightShoulder.x) / 2) * imageWidth,
      y: ((leftShoulder.y + rightShoulder.y) / 2 - 0.03) * imageHeight,
    },
  };
}

export function drawPoseLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: PoseLandmark[],
  imageWidth: number,
  imageHeight: number
): void {
  // Draw connections
  const connections = [
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER],
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
    [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
    [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
    [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
    [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
    [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
    [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
    [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
    [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
    [POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
  ];

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;

  for (const [start, end] of connections) {
    const startPoint = landmarks[start];
    const endPoint = landmarks[end];
    
    ctx.beginPath();
    ctx.moveTo(startPoint.x * imageWidth, startPoint.y * imageHeight);
    ctx.lineTo(endPoint.x * imageWidth, endPoint.y * imageHeight);
    ctx.stroke();
  }

  // Draw landmarks
  ctx.fillStyle = '#8B0000';
  for (const landmark of landmarks) {
    ctx.beginPath();
    ctx.arc(landmark.x * imageWidth, landmark.y * imageHeight, 4, 0, 2 * Math.PI);
    ctx.fill();
  }
}
