import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView
} from 'react-native';

interface StatsPanelProps {
  fps: number;
  inferenceTime: number;
  poseCount: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  fps,
  inferenceTime,
  poseCount
}) => {
  const getFpsColor = (fpsValue: number) => {
    if (fpsValue >= 30) return '#4CAF50';
    if (fpsValue >= 20) return '#FFC107';
    return '#F44336';
  };

  const getInferenceColor = (time: number) => {
    if (time <= 16) return '#4CAF50';
    if (time <= 33) return '#FFC107';
    return '#F44336';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>FPS</Text>
          <Text style={[styles.statValue, { color: getFpsColor(fps) }]}>
            {fps > 0 ? fps.toFixed(0) : '--'}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Inference</Text>
          <Text style={[styles.statValue, { color: getInferenceColor(inferenceTime) }]}>
            {inferenceTime > 0 ? `${inferenceTime}ms` : '--'}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Poses</Text>
          <Text style={[styles.statValue, { color: '#2196F3' }]}>
            {poseCount}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    margin: 10,
    borderRadius: 10,
    padding: 12,
    paddingTop: 8
  },
  statItem: {
    alignItems: 'center',
    minWidth: 70
  },
  statLabel: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});