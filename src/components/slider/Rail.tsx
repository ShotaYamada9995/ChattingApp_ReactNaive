import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';

const Rail = () => {
  return <View style={styles.root} />;
};

export default memo(Rail);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7f7f7f',
  },
});

// import React, {memo, useCallback} from 'react';
// import {View, StyleSheet, Image} from 'react-native';
// import {Frame} from '../../screens/VideoCapture/VideoEditor/types';

// interface RailProps {
//   frames: Frame[];
// }

// const Rail = ({frames}: RailProps) => {
//   const renderImages = useCallback(() => {
//     return frames.map((frame: Frame) => (
//       <Image
//         key={frame.time}
//         source={{uri: frame.image}}
//         style={styles.image}
//       />
//     ));
//   }, []);
//   return <View style={styles.container}>{renderImages()}</View>;
// };

// export default memo(Rail);

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: 20,
//     aspectRatio: 9 / 16,
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
// });
