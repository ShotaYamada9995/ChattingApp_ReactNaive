import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const VideoLoadingIndicator = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" style={styles.loadingIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    marginTop: 5,
    marginLeft: 5,
  },
});

export default VideoLoadingIndicator;
