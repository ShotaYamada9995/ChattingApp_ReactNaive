import React, {useEffect} from 'react';
import {StatusBar, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RNBootSplash from 'react-native-bootsplash';
import {useSelector} from 'react-redux';

import RegisterOptions from './screens/Authentication/RegisterOptions';
import RegisterEmail from './screens/Authentication/RegisterEmail';
import RegisterPassword from './screens/Authentication/RegisterPassword';
import VerifyEmail from './screens/Authentication/VerifyEmail';
import LoginOptions from './screens/Authentication/LoginOptions';
import LoginForm from './screens/Authentication/LoginForm';
import Main from './navigation/MainNavigator';
import VideoEditor from './screens/VideoCapture/VideoEditor';
import Trim from './screens/VideoCapture/VideoEditor/Trim';

type AppStackParamsList = {
  RegisterOptions: undefined;
  RegisterEmail: undefined;
  RegisterPassword: undefined;
  VerifyEmail: {code: string};
  LoginOptions: undefined;
  LoginForm: undefined;
  Main: undefined;
  VideoEditor: undefined;
  Trim: undefined;
};

const AppStack = createNativeStackNavigator<AppStackParamsList>();

const AuthScreenStack = () => {
  return (
    <AppStack.Navigator
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <AppStack.Screen name="RegisterOptions" component={RegisterOptions} />
      <AppStack.Screen name="RegisterEmail" component={RegisterEmail} />
      <AppStack.Screen name="RegisterPassword" component={RegisterPassword} />
      <AppStack.Screen name="VerifyEmail" component={VerifyEmail} />
      <AppStack.Screen name="LoginOptions" component={LoginOptions} />
      <AppStack.Screen name="LoginForm" component={LoginForm} />
    </AppStack.Navigator>
  );
};

const MainScreenStack = () => {
  return (
    <AppStack.Navigator
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <AppStack.Screen name="Main" component={Main} />
      <AppStack.Screen
        name="VideoEditor"
        component={VideoEditor}
        options={{animation: 'slide_from_bottom'}}
      />
      <AppStack.Screen
        name="Trim"
        component={Trim}
        options={{animation: 'slide_from_bottom'}}
      />
    </AppStack.Navigator>
  );
};

export default () => {
  const user = useSelector(state => state.user);

  const renderScreenStack = () => {
    if (user.isLoggedIn) {
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
