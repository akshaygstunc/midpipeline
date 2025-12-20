import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  AppState,
  AppStateStatus,
  Text
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
  Frame
} from 'react-native-vision-camera';
import { PoseOverlay } from './PoseOverlay';
import { Pose } from '../../types/pose';
import { PerformanceMonitor } from '../../modules/performance/PerformanceMonitor';
import { StatsPanel } from '../StatsPanel/StatsPanel';
import { createFrameProcessor } from '../../modules/pose-detection/FrameProcessor';

const { width, height } = Dimensions.get('window');

export const CameraView: React.FC = () => {
  const devices = useCameraDevices();
  const camera = useRef<Camera>(null);
  const device = devices.back;
  
  const [poses, setPoses] = useState<Pose[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [performanceStats, setPerformanceStats] = useState({
    fps: 0,
    inferenceTime: 0,
    isActive: true
  });
  
  const performanceMonitor = useRef(new PerformanceMonitor());

  useEffect(() => {
    const checkPermission = async () => {
      const status = await Camera.getCameraPermissionStatus();
      if (status === 'not-determined') {
        const newStatus = await Camera.requestCameraPermission();
        setHasPermission(newStatus === 'authorized');
      } else {
        setHasPermission(status === 'authorized');
      }
    };
    checkPermission();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      setPerformanceStats(prev => ({
        ...prev,
        isActive: nextAppState === 'active'
      }));
    });

    return () => subscription.remove();
  }, []);

  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    
    const result = createFrameProcessor(frame, null);
    
    runOnJS(setPoses)(result.poses);
    runOnJS(performanceMonitor.current.recordInferenceTime)(result.inferenceTime);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      performanceMonitor.current.updateFrame();
      const stats = performanceMonitor.current.getStats();
      setPerformanceStats(prev => ({
        ...prev,
        fps: stats.fps,
        inferenceTime: stats.inferenceTime
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.text}>Checking camera permission...</Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.text}>No camera access</Text>
          <Text style={styles.subText}>
            Please enable camera permissions in settings
          </Text>
        </View>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.text}>No camera device found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={performanceStats.isActive && hasPermission}
        frameProcessor={frameProcessor}
        frameProcessorFps={30}
        preset="medium"
        pixelFormat="yuv"
        orientation="portrait"
        torch="off"
        audio={false}
      />
      
      <PoseOverlay
        poses={poses}
        width={width}
        height={height}
      />
      
      <StatsPanel
        fps={performanceStats.fps}
        inferenceTime={performanceStats.inferenceTime}
        poseCount={poses.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10
  },
  subText: {
    color: '#888',
    fontSize: 14
  }
});