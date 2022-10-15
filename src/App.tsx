import React, {useEffect} from 'react';
import TabNavigator from './TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RNBootSplash from 'react-native-bootsplash';

export default () => {
  useEffect(() => {
    RNBootSplash.hide({fade: true});
  }, []);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
