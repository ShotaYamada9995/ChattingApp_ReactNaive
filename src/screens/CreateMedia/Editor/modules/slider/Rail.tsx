import React from 'react';
import {View, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {WINDOW_WIDTH} from '../../../../../utils';
interface Frame {
  time: number;
  image: string;
}
interface RailProps {
  frames: Frame[];
}

const Rail = ({frames}: RailProps) => {
  return (
    <View style={styles.container}>
      {frames.length > 0
        ? frames.map(frame => (
            <Image
              key={frame.time}
              source={{uri: frame.image}}
              style={{
                width: WINDOW_WIDTH * 0.064,
                height: 40,
              }}
            />
          ))
        : Array(10)
            .fill(' ')
            .map((_, index) => (
              <View key={index} style={styles.imagePlaceholder} />
            ))}
    </View>
  );
};

export default Rail;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: WINDOW_WIDTH * 0.064,
    height: 40,
    backgroundColor: 'rgba(100,100,100,0.5)',
    borderRightWidth: 1,
    borderRightColor: 'grey',
  },
});
