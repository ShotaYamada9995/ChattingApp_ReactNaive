import React from 'react';
import {View, StyleSheet} from 'react-native';

export default () => <View style={styles.container} />;

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 40,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'white',
    backgroundColor: '#001433',
  },
});

// import React, {memo} from 'react';
// import {View, StyleSheet, Image} from 'react-native';
// interface ThumbProps {
//   image: string;
// }

// const Thumb = ({image}: ThumbProps) => {
//   return (
//     <View style={styles.container}>
//       <Image source={{uri: image}} style={styles.image} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: 40,
//     aspectRatio: 3 / 4,
//     left: 20,
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
// });

// export default memo(Thumb);
