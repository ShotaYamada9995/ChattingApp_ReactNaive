import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import VideoPostSkeleton from '../../components/skeleton/VideoPostSkeleton';

export default () => {
  return (
    <View style={styles.container}>
      <VideoPostSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
