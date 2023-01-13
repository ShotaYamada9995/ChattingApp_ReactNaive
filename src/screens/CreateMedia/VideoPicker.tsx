import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Button} from '@rneui/base';
import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {Camera, useCameraDevices, VideoFile} from 'react-native-vision-camera';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {Icon} from '@rneui/themed';
import {useDispatch} from 'react-redux';
import VideoPicker from 'react-native-image-crop-picker';

import {update} from '../../store/reducers/Video';
import {useIsForeground} from '../../hooks/useIsForeground';
import {useToast} from 'react-native-toast-notifications';
import {WINDOW_WIDTH} from '../../utils';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

export default () => {
  const toast = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isCameraPermitted, setIsCameraPermitted] = useState(false);
  const [isMicrophonePermitted, setIsMicrophonePermitted] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const [video, setVideo] = useState({
    isRecording: false,
    isPaused: false,
    flash: 'off',
  });

  const isRecordingCancelled = useRef<true | false>(false);

  const devices = useCameraDevices('wide-angle-camera');
  const device: any = devices[cameraPosition];

  const isForeGround = useIsForeground();
  const isFocused = useIsFocused();
  const isActive = isForeGround && isFocused;

  const supportsCameraFlipping = useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  );
  const supportsFlash = device?.hasFlash ?? false;

  const camera = useRef<Camera>(null);

  const togglePause = async () => {
    if (video.isPaused) {
      await camera.current?.resumeRecording();
      setVideo(video => ({...video, isPaused: false}));
    } else {
      await camera.current?.pauseRecording();
      setVideo(video => ({...video, isPaused: true}));
    }
  };

  const toggleCameraPosition = () => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setVideo(video => ({...video, flash: video.flash === 'on' ? 'off' : 'on'}));
  };

  const onRecordingFinished = async (video: VideoFile) => {
    if (!isRecordingCancelled.current) {
      dispatch(update(video));
      navigation.navigate('VideoEditor');
    } else {
      isRecordingCancelled.current = false;
    }
  };

  const startRecording = async () => {
    camera.current?.startRecording({
      flash: video.flash,
      onRecordingFinished,
      onRecordingError: error => console.error('Error => ', error),
    });
    setVideo(video => ({...video, isRecording: true}));
  };

  const stopRecording = async () => {
    await camera.current?.stopRecording();
    setVideo(video => ({...video, isRecording: false, isPaused: false}));
  };

  const cancelRecording = () => {
    isRecordingCancelled.current = true;
    stopRecording();
  };

  const selectVideoFromLib = async () => {
    VideoPicker.openPicker({
      mediaType: 'video',
    })
      .then(video => {
        if (video.mime.includes('video')) {
          const duration = video.duration / 1000;
          dispatch(
            update({
              duration,
              path: video.path,
            }),
          );
          navigation.navigate('VideoEditor');
        } else {
          Alert.alert('You can only select videos');
        }
      })
      .catch(err => {
        return;
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
      try {
        const newCameraPermission = await Camera.requestCameraPermission();

        setIsCameraPermitted(newCameraPermission === 'authorized');
      } catch (error) {
        toast.show('Go to your device settings to Enable Camera', {
          type: 'normal',
          duration: 5000,
        });
      }
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
      try {
        const newMicrophonePermission =
          await Camera.requestMicrophonePermission();

        setIsMicrophonePermitted(newMicrophonePermission === 'authorized');
      } catch (error) {
        toast.show('Go to your device settings to Enable Microphone', {
          type: 'normal',
          duration: 5000,
        });
      }
    } else {
      setIsMicrophonePermitted(true);
    }
  };

  useEffect(() => {
    if (isFocused) {
      changeNavigationBarColor('black');
    }
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      await requestCameraPermission();
      await requestMicrophonePermission();
    })();
  }, []);

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
        isActive={isActive}
        video
        audio
      />

      {!video.isRecording && (
        <View style={styles.sidebar}>
          {supportsCameraFlipping && (
            <TouchableOpacity onPress={toggleCameraPosition}>
              <Icon
                name="repeat"
                type="ionicon"
                color="white"
                size={35}
                style={styles.sidebarIcon}
              />
            </TouchableOpacity>
          )}

          {supportsFlash && (
            <TouchableOpacity onPress={toggleFlash}>
              <Icon
                name={video.flash === 'on' ? 'flash' : 'flash-off'}
                type="ionicon"
                color="white"
                size={35}
                style={styles.sidebarIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.bottomBarContainer}>
        {video.isRecording ? (
          <TouchableOpacity onPress={cancelRecording}>
            <Icon name="close-circle" type="ionicon" color="white" size={40} />
          </TouchableOpacity>
        ) : (
          <Icon
            name="close-circle"
            type="ionicon"
            color="white"
            size={40}
            style={{opacity: 0}}
          />
        )}

        {video.isRecording ? (
          <TouchableOpacity onPress={togglePause}>
            <CountdownCircleTimer
              isPlaying={!video.isPaused}
              duration={120}
              colors="#d9d9d9"
              trailColor="#ff4040"
              strokeWidth={5}
              size={100}
              onComplete={stopRecording}>
              {({remainingTime}) =>
                video.isPaused ? (
                  <Icon
                    name="play"
                    type="ionicon"
                    color="#ff4040"
                    size={50}
                    style={{marginLeft: 3}}
                  />
                ) : (
                  <Icon
                    name="stop"
                    type="ionicon"
                    color="#ff4040"
                    size={50}
                    style={{marginLeft: 3}}
                  />
                )
              }
            </CountdownCircleTimer>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.recordBtn} onPress={startRecording} />
        )}

        {video.isRecording ? (
          <TouchableOpacity onPress={stopRecording}>
            <Icon
              name="checkmark-circle"
              type="ionicon"
              color="#ff4040"
              size={40}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={selectVideoFromLib}
            style={styles.uploadBtn}>
            <Icon
              name="image-outline"
              type="ionicon"
              color="white"
              size={WINDOW_WIDTH * 0.1}
            />
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>
        )}
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
  sidebar: {position: 'absolute', top: 50, right: 10},
  sidebarIcon: {marginBottom: 10},
  bottomBarContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  recordBtn: {
    borderWidth: 8,
    borderColor: '#ff404087',
    backgroundColor: '#ff4040',
    borderRadius: 100,
    height: 100,
    width: 100,
  },
  uploadBtn: {
    alignItems: 'center',
  },
  uploadText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 5,
  },
});
