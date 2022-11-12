import React, {memo} from 'react';
import {View, StyleSheet, Image} from 'react-native';
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
    width: 40,
    aspectRatio: 3 / 4,
    left: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default memo(Thumb);
