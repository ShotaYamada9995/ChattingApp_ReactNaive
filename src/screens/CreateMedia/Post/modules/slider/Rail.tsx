import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
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
      {frames.map(frame => (
        <Image
          key={frame.time}
          source={{uri: frame.image}}
          style={{
            width: 30,
            aspectRatio: 3 / 4,
          }}
        />
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
  root: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7f7f7f',
  },
});
