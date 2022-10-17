import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

const Following = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Following;
