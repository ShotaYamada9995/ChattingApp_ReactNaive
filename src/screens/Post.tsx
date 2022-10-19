import {useIsFocused} from '@react-navigation/native';
import {Button} from '@rneui/base';
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {Icon} from '@rneui/themed';

const PostScreen = () => {
  const [isCameraPermitted, setIsCameraPermitted] = useState(false);
  const [isMicrophonePermitted, setIsMicrophonePermitted] = useState(false);
  const [recordStatus, setRecordStatus] = useState('STOP'); // START, PAUSE, STOP

  const devices = useCameraDevices('wide-angle-camera');
  const device: any = devices.back;
  const isFocused = useIsFocused();

  const camera = useRef<Camera>(null);

  const requestPermissions = async () => {
    /* Check permissions */
    const cameraPermission = await Camera.getCameraPermissionStatus();
    const microphonePermission = await Camera.getMicrophonePermissionStatus();

    /* Request permissions */

    // Camera
    if (cameraPermission === 'restricted') {
      Alert.alert('Cannot use camera');
    } else if (
      cameraPermission === 'not-determined' ||
      cameraPermission === 'denied'
    ) {
      const newCameraPermission = await Camera.requestCameraPermission();

      setIsCameraPermitted(newCameraPermission === 'authorized');
    } else {
      setIsCameraPermitted(true);
    }

    // Microphone
    if (microphonePermission === 'restricted') {
      Alert.alert('Cannot use microphone');
    } else if (
      microphonePermission === 'not-determined' ||
      microphonePermission === 'denied'
    ) {
      const newMicrophonePermission =
        await Camera.requestMicrophonePermission();

      setIsMicrophonePermitted(newMicrophonePermission === 'authorized');
    } else {
      setIsMicrophonePermitted(true);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);
  if (!isCameraPermitted)
    return (
      <View style={styles.defaultContainer}>
        <Text>Camera permission not yet granted</Text>
        <Button title="Grant permission" />
      </View>
    );

  if (device == null)
    return (
      <View style={styles.defaultContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  return (
    <View style={styles.cameraContainer}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        video
        audio
      />

      <View style={styles.bottomBarContainer}>
        <View style={{flex: 1}} />

        <View style={styles.recordBtnContainer}>
          {/* <TouchableOpacity style={styles.recordBtn} /> */}
          <TouchableOpacity>
            <CountdownCircleTimer
              isPlaying={true}
              duration={15}
              colors="#d9d9d9"
              trailColor="#ff4040"
              strokeWidth={5}
              size={100}>
              {({remainingTime}) => (
                <Icon
                  name="stop"
                  type="ionicon"
                  color="#ff4040"
                  size={50}
                  style={{marginLeft: 3}}
                />
              )}
            </CountdownCircleTimer>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity style={styles.galleryBtn} />
          {/* <Icon name="close-circle" type="ionicon" color="white" size={35} />
          <Icon
            name="checkmark-circle"
            type="ionicon"
            color="#ff4040"
            size={35}
            style={{marginLeft: 20}}
          /> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  defaultContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordBtnContainer: {
    flex: 1,
    marginHorizontal: 30,
  },
  recordBtn: {
    borderWidth: 8,
    borderColor: '#ff404087',
    backgroundColor: '#ff4040',
    borderRadius: 100,
    height: 80,
    width: 80,
  },
  galleryBtn: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    width: 40,
    height: 40,
  },
});

export default PostScreen;
