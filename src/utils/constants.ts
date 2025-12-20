export const POSE_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
  [9, 10], [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
  [17, 19], [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
  [11, 23], [12, 24], [23, 24], [23, 25], [24, 26], [25, 27], [26, 28],
  [27, 29], [28, 30], [29, 31], [30, 32]
];

export const LANDMARK_NAMES = [
  'nose', 'leftEyeInner', 'leftEye', 'leftEyeOuter',
  'rightEyeInner', 'rightEye', 'rightEyeOuter', 'leftEar',
  'rightEar', 'mouthLeft', 'mouthRight', 'leftShoulder',
  'rightShoulder', 'leftElbow', 'rightElbow', 'leftWrist',
  'rightWrist', 'leftPinky', 'rightPinky', 'leftIndex',
  'rightIndex', 'leftThumb', 'rightThumb', 'leftHip',
  'rightHip', 'leftKnee', 'rightKnee', 'leftAnkle',
  'rightAnkle', 'leftHeel', 'rightHeel', 'leftFootIndex',
  'rightFootIndex'
];

export const CONFIG = {
  MODEL_PATH: 'pose_detector.tflite',
  NUM_THREADS: 4,
  DELEGATE: 'GPU',
  MIN_DETECTION_CONFIDENCE: 0.5,
  MIN_SUPPRESSION_THRESHOLD: 0.3,
  MAX_NUM_POSES: 2
};