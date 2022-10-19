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
  const [video, setVideo] = useState({
    isRecording: false,
    isPaused: false,
    useFlash: false,
  });

  const devices = useCameraDevices('wide-angle-camera');
  const device: any = devices.back;
  const isFocused = useIsFocused();

  const camera = useRef<Camera>(null);

  const togglePause = () => {
    setVideo(video => ({...video, isPaused: !video.isPaused}));
  };

  const toggleFlash = () => {
    setVideo(video => ({...video, useFlash: !video.useFlash}));
  };

  const recordVideo = async () => {
    camera.current.startRecording({
      flash: video.useFlash ? 'on' : 'off',
      onRecordingFinished: video => console.log(video),
      onRecordingError: error => console.error(error),
    });
  };

  const requestCameraPermission = async () => {
    // check permission
    const cameraPermission = await Camera.getCameraPermissionStatus();

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
  };

  const requestMicrophonePermission = async () => {
    // check permission
    const microphonePermission = await Camera.getMicrophonePermissionStatus();

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
    (async () => {
      await requestCameraPermission();
      await requestMicrophonePermission();
    })();
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

      <View style={styles.sidebar}>
        <Icon
          name="repeat"
          type="ionicon"
          color="white"
          size={35}
          style={styles.sidebarIcon}
        />
        <Icon
          name={video.useFlash ? 'flash' : 'flash-off'}
          type="ionicon"
          color="white"
          size={35}
          onPress={toggleFlash}
          style={styles.sidebarIcon}
        />
      </View>

      <View style={styles.bottomBarContainer}>
        <View style={{flex: 1}}>
          {video.isRecording && video.isPaused && (
            <Icon
              name="close-circle"
              type="ionicon"
              color="white"
              size={40}
              style={{marginLeft: 20}}
              onPress={() => setVideo({isRecording: false, isPaused: false})}
            />
          )}
        </View>

        <View style={styles.recordBtnContainer}>
          {video.isRecording ? (
            <TouchableOpacity onPress={togglePause}>
              <CountdownCircleTimer
                isPlaying={!video.isPaused}
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
          ) : (
            <TouchableOpacity
              style={styles.recordBtn}
              onPress={() => setVideo(video => ({...video, isRecording: true}))}
            />
          )}
        </View>

        <View style={{flex: 1}}>
          {video.isRecording ? (
            <Icon
              name="checkmark-circle"
              type="ionicon"
              color="#ff4040"
              size={40}
              style={{marginRight: 20}}
            />
          ) : (
            <TouchableOpacity style={styles.galleryBtn} />
          )}
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
  sidebar: {position: 'absolute', top: 20, right: 10},
  sidebarIcon: {marginBottom: 10},
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
    height: 100,
    width: 100,
  },
  galleryBtn: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    width: 40,
    height: 40,
    marginLeft: 10,
  },
});

export default PostScreen;
