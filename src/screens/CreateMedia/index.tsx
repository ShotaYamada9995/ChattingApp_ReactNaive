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
} from 'react-native';
import {Camera, useCameraDevices, VideoFile} from 'react-native-vision-camera';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {Icon} from '@rneui/themed';
import {useDispatch} from 'react-redux';
import VideoPicker from 'react-native-image-crop-picker';

import {update} from '../../store/reducers/Video';
import {useIsForeground} from '../../hooks/useIsForeground';

const VideoCapture = () => {
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

  const selectVideoFromLib = () => {
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

  // if (!isCameraPermitted)
  //   return (
  //     <View style={styles.defaultContainer}>
  //       <Text>Camera permission not yet granted</Text>
  //       <Button title="Grant permission" />
  //     </View>
  //   );

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
        <View style={{flex: 1}}>
          {video.isRecording && video.isPaused && (
            <Icon
              name="close-circle"
              type="ionicon"
              color="white"
              size={40}
              style={{marginLeft: 20}}
              onPress={cancelRecording}
            />
          )}
        </View>

        <View style={styles.recordBtnContainer}>
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
              onPress={startRecording}
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
              onPress={stopRecording}
            />
          ) : (
            <TouchableOpacity onPress={selectVideoFromLib}>
              <View style={styles.galleryBtn} />
              <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
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
  },
  uploadText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default VideoCapture;
