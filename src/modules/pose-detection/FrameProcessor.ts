import { Worklets } from 'react-native-worklets-core';

// Mock frame processor for demo
export const createFrameProcessor = Worklets.createRunInJsFn((
  frame: any,
  detector: any
) => {
  'worklet';
  
  // Generate mock pose data
  const mockPose = {
    landmarks: Array.from({ length: 33 }, (_, i) => ({
      x: 0.3 + Math.random() * 0.4,
      y: 0.3 + Math.random() * 0.4,
      z: Math.random() * 2 - 1,
      visibility: 0.8 + Math.random() * 0.2
    })),
    score: 0.8 + Math.random() * 0.2,
    bounds: {
      origin: { x: 0.3, y: 0.3 },
      size: { width: 0.4, height: 0.4 }
    }
  };

  return {
    poses: [mockPose],
    inferenceTime: 16 + Math.random() * 10, // 16-26ms
    timestamp: Date.now()
  };
});

// Utility hook for pose detection
export function usePoseDetection() {
  return {
    frameProcessor: (frame: any) => {
      'worklet';
      const result = createFrameProcessor(frame, null);
      return result;
    }
  };
}