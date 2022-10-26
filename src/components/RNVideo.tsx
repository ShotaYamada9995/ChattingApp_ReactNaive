import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import Video from 'react-native-video';

const RNVideo = ({reference, source, paused, onEnd, onProgress}) => {
  console.log('Rendered...');
  return (
    <Video
      ref={reference}
      source={source}
      style={styles.video}
      paused={paused}
      onEnd={onEnd}
      onProgress={onProgress}
    />
  );
};

const styles = StyleSheet.create({
  video: {
    alignSelf: 'center',
    width: '65%',
    aspectRatio: 9 / 16,
    marginTop: 10,
  },
});

export default memo(RNVideo);
