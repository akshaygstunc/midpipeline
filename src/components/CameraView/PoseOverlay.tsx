import React from 'react';
import { Canvas, Path, Skia, Group } from '@shopify/react-native-skia';
import { Pose } from '../../types/pose';
import { POSE_CONNECTIONS } from '../../utils/constants';

interface PoseOverlayProps {
  poses: Pose[];
  width: number;
  height: number;
}

export const PoseOverlay: React.FC<PoseOverlayProps> = ({
  poses,
  width,
  height
}) => {
  if (!poses || poses.length === 0) {
    return null;
  }

  const connectionElements = poses.flatMap((pose, poseIndex) => {
    const landmarks = pose.landmarks;
    
    return POSE_CONNECTIONS.map(([startIdx, endIdx], connectionIndex) => {
      const startPoint = landmarks[startIdx];
      const endPoint = landmarks[endIdx];

      if (!startPoint || !endPoint || 
          startPoint.visibility === undefined || endPoint.visibility === undefined ||
          startPoint.visibility < 0.3 || endPoint.visibility < 0.3) {
        return null;
      }
      
      const path = Skia.Path.Make();
      path.moveTo(startPoint.x * width, startPoint.y * height);
      path.lineTo(endPoint.x * width, endPoint.y * height);
      
      return (
        <Path
          key={`pose-${poseIndex}-connection-${connectionIndex}`}
          path={path}
          color="#00FF00"
          style="stroke"
          strokeWidth={3}
          strokeCap="round"
          strokeJoin="round"
        />
      );
    }).filter(Boolean);
  });

  const landmarkElements = poses.flatMap((pose, poseIndex) =>
    pose.landmarks.map((landmark, index) => {
      if (!landmark || landmark.visibility === undefined || landmark.visibility < 0.3) {
        return null;
      }

      const landmarkSize = 8;
      const x = landmark.x * width;
      const y = landmark.y * height;
      
      const circlePath = Skia.Path.Make();
      circlePath.addCircle(x, y, landmarkSize);
      
      return (
        <Path
          key={`pose-${poseIndex}-landmark-${index}`}
          path={circlePath}
          color="#FF0000"
        />
      );
    }).filter(Boolean)
  );

  return (
    <Canvas style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0,
      width,
      height 
    }}>
      {connectionElements}
      {landmarkElements}
    </Canvas>
  );
};