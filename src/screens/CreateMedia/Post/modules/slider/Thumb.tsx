import React, {memo} from 'react';
import {View, StyleSheet, Image} from 'react-native';

const THUMB_RADIUS_LOW = 12;
const THUMB_RADIUS_HIGH = 16;

interface ThumbProps {
  image: string;
}

const Thumb = ({image}: ThumbProps) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: image}} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 30,
    aspectRatio: 3 / 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default memo(Thumb);
