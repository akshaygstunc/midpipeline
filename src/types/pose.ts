export interface Landmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface Pose {
  landmarks: Landmark[];
  score: number;
  bounds: {
    origin: { x: number; y: number };
    size: { width: number; height: number };
  };
}

export interface DetectionResult {
  poses: Pose[];
  inferenceTime: number;
  timestamp: number;
}

export interface CameraSize {
  width: number;
  height: number;
}