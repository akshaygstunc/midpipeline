import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  PermissionsAndroid,
  Alert
} from 'react-native';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { CameraView } from './src/components/CameraView/CameraView';

const App: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
/// Check camera permission
  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        // Android permission check
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission Required',
            message: 'This app needs camera access to detect poses',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        // iOS permission check
        const result = await check(PERMISSIONS.IOS.CAMERA);
        if (result === RESULTS.DENIED) {
          const requestResult = await request(PERMISSIONS.IOS.CAMERA);
          setHasPermission(requestResult === RESULTS.GRANTED);
        } else {
          setHasPermission(result === RESULTS.GRANTED);
        }
      }
    } catch (err) {
      console.error('Permission error:', err);
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  };

  const requestPermissionAgain = () => {
    setLoading(true);
    checkCameraPermission();
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.text}>Checking camera permission...</Text>
          <Text style={styles.subText}>Please wait</Text>
        </View>
      </SafeAreaView>
    );
  }

  // No permission state
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>⚠️ Camera Access Denied</Text>
          <Text style={styles.subText}>
            This app needs camera access to work
          </Text>
          <View style={styles.button} onTouchEnd={requestPermissionAgain}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </View>
          <Text style={styles.helpText}>
            Go to Settings → Apps → PoseDetectionDemo → Permissions → Camera
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Main app with camera
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#000" 
        translucent={false}
      />
      <CameraView />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center'
  },
  subText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  helpText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20
  }
});

export default App;