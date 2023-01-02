import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Video from 'react-native-video';
import {Icon, Button} from '@rneui/themed';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import {useIsForeground} from '../../../hooks/useIsForeground';
import VideoLoadingIndicator from '../../../components/shared/VideoLoadingIndicator';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const VideoEditor = () => {
  const navigation = useNavigation();
  const video = useSelector(state => state.video);
  const isForeGround = useIsForeground();
  const isFocused = useIsFocused();
  const canPlayVideo = isForeGround && isFocused;

  const goToPost = () => {
    if (video.duration > 120) {
      Alert.alert(
        'Video duration cannot exceed 2 minuetes. Trim the video or select a new video.',
      );
    } else {
      navigation.navigate('PostMedia');
    }
  };

  useEffect(() => {
    if (isFocused) {
      changeNavigationBarColor('black');
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {isFocused ? (
        <Video
          source={{uri: video.path}}
          style={styles.video}
          resizeMode="contain"
          paused={!canPlayVideo}
          repeat
        />
      ) : (
        <VideoLoadingIndicator />
      )}

      <TouchableOpacity
        style={styles.navIcon}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" color="white" />
      </TouchableOpacity>

      <View style={styles.sideBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Trim')}>
          <Icon name="cut" type="ionicon" color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.btnContainer}>
        <Button
          title="Your Story"
          containerStyle={styles.btn}
          buttonStyle={{paddingVertical: 10, borderColor: '#001433'}}
          titleStyle={{color: '#001433'}}
          color="white"
        />
        <Button
          title="Next"
          containerStyle={styles.btn}
          buttonStyle={{paddingVertical: 10}}
          color="#001433"
          onPress={goToPost}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  navIcon: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  sideBar: {position: 'absolute', top: 50, right: 10},
  btnContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  btn: {
    width: '48%',
    marginTop: 50,
    alignSelf: 'center',
  },
});

export default VideoEditor;
