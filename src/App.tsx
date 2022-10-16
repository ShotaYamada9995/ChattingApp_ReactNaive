import React, {useEffect, useState} from 'react';
import {StatusBar, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RNBootSplash from 'react-native-bootsplash';

import Register from './screens/Authentication/Register';
import Login from './screens/Authentication/Login';
import Main from './navigation/MainNavigator';
import {Button} from '@rneui/base';

type AppStackParamsList = {
  Register: undefined;
  Login: undefined;
  Main: undefined;
};

const AppStack = createNativeStackNavigator<AppStackParamsList>();

const AuthScreenStack = () => {
  return (
    <AppStack.Navigator screenOptions={{headerShown: false}}>
      <AppStack.Screen name="Register" component={Register} />
      <AppStack.Screen name="Login" component={Login} />
    </AppStack.Navigator>
  );
};

const MainScreenStack = () => {
  return (
    <AppStack.Navigator screenOptions={{headerShown: false}}>
      <AppStack.Screen name="Main" component={Main} />
    </AppStack.Navigator>
  );
};

export default () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const renderScreenStack = () => {
    if (isLoggedIn) {
      return <MainScreenStack />;
    }
    return <AuthScreenStack />;
  };

  useEffect(() => {
    RNBootSplash.hide();
  }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <NavigationContainer>{renderScreenStack()}</NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
