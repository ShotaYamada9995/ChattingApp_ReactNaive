import React, {useEffect} from 'react';
import {StatusBar, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RNBootSplash from 'react-native-bootsplash';
import {useSelector} from 'react-redux';
import {ToastProvider} from 'react-native-toast-notifications';

import RegisterOptions from './screens/Authentication/RegisterOptions';
import RegisterEmail from './screens/Authentication/RegisterEmail';
import RegisterPassword from './screens/Authentication/RegisterPassword';
import VerifyEmail from './screens/Authentication/VerifyEmail';
import RegisterBio from './screens/Authentication/RegisterBio';
import ConfirmBio from './screens/Authentication/ConfirmBio';
import LoginOptions from './screens/Authentication/LoginOptions';
import LoginForm from './screens/Authentication/LoginForm';
import Main from './navigation/MainNavigator';
import VideoEditor from './screens/CreateMedia/Editor';
import Trim from './screens/CreateMedia/Editor/Trim';
import PostMedia from './screens/CreateMedia/Post';
import MiniProfile from './screens/Profiles/MiniProfile';

type AppStackParamsList = {
  RegisterOptions: undefined;
  RegisterEmail: undefined;
  RegisterPassword: undefined;
  VerifyEmail: undefined;
  RegisterBio: undefined;
  ConfirmBio: undefined;
  LoginOptions: undefined;
  LoginForm: undefined;
  Main: undefined;
  VideoEditor: undefined;
  Trim: undefined;
  PostMedia: undefined;
  MiniProfile: undefined;
};

const AppStack = createNativeStackNavigator<AppStackParamsList>();

// const AuthScreenStack = () => {
//   return (
//     <AppStack.Navigator
//       screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
//       <AppStack.Screen name="RegisterOptions" component={RegisterOptions} />
//       <AppStack.Screen name="RegisterEmail" component={RegisterEmail} />
//       <AppStack.Screen name="RegisterPassword" component={RegisterPassword} />
//       <AppStack.Screen name="VerifyEmail" component={VerifyEmail} />
//       <AppStack.Screen name="RegisterBio" component={RegisterBio} />
//       <AppStack.Screen name="ConfirmBio" component={ConfirmBio} />
//       <AppStack.Screen name="LoginOptions" component={LoginOptions} />
//       <AppStack.Screen name="LoginForm" component={LoginForm} />
//     </AppStack.Navigator>
//   );
// };

export default () => {
  const user = useSelector(state => state.user);

  useEffect(() => {
    RNBootSplash.hide();
  }, []);

  return (
    <ToastProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{flex: 1}}>
          <StatusBar barStyle="dark-content" backgroundColor="white" />
          <NavigationContainer>
            <AppStack.Navigator
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}>
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
              <AppStack.Screen name="PostMedia" component={PostMedia} />
              <AppStack.Screen name="MiniProfile" component={MiniProfile} />
              {!user.isLoggedIn ? (
                <>
                  <AppStack.Screen
                    name="RegisterOptions"
                    component={RegisterOptions}
                  />
                  <AppStack.Screen
                    name="RegisterEmail"
                    component={RegisterEmail}
                  />
                  <AppStack.Screen
                    name="RegisterPassword"
                    component={RegisterPassword}
                  />
                  <AppStack.Screen name="VerifyEmail" component={VerifyEmail} />
                  <AppStack.Screen name="RegisterBio" component={RegisterBio} />
                  <AppStack.Screen name="ConfirmBio" component={ConfirmBio} />
                  <AppStack.Screen
                    name="LoginOptions"
                    component={LoginOptions}
                  />
                  <AppStack.Screen name="LoginForm" component={LoginForm} />
                </>
              ) : null}
            </AppStack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </ToastProvider>
  );
};
