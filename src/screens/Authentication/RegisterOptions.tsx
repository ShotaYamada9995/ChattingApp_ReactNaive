import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import AuthHeader from '../../components/headers/AuthHeader';
import AuthCard from '../../components/cards/AuthCard';
import AuthFooter from '../../components/footers/AuthFooter';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {LoginManager, Profile} from 'react-native-fbsdk-next';

GoogleSignin.configure({
  webClientId:
    '785026767949-34llf1shc57qoll1jcudcjv45u7gbqin.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
});

const RegisterOptions = () => {
  const navigation = useNavigation();

  const signUpWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google User: ', userInfo);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('Google cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('Google in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('Google play services not available');
      } else {
        // some other error happened
        console.error('Google error: ', error);
      }
    }
  };

  const signUpWithFacebook = async () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      async function (result) {
        if (result.isCancelled) {
          console.log('Facebook cancelled');
        } else {
          console.log(
            'Facebook login success with permissions: ' +
              result.grantedPermissions?.toString(),
          );

          const currentProfile = await Profile.getCurrentProfile();
          if (currentProfile) {
            console.log('Facebook user: ', currentProfile);
          }
        }
      },
      function (error) {
        console.log('Facebook login fail with error: ' + error);
      },
    );
  };

  return (
    <View style={styles.container}>
      <AuthHeader title="Sign Up" />

      <ScrollView contentContainerStyle={styles.authCardContainer}>
        <AuthCard
          icon="person"
          title="Use Email or Phone"
          onPress={() => {
            navigation.navigate('RegisterEmail');
          }}
        />
        <AuthCard
          icon="logo-google"
          title="Continue with Google"
          onPress={signUpWithGoogle}
        />
        <AuthCard icon="logo-apple" title="Continue with Apple" />
        <AuthCard
          icon="logo-facebook"
          title="Continue with Facebook"
          onPress={signUpWithFacebook}
        />
        <AuthCard icon="logo-twitter" title="Continue with Twitter" />
      </ScrollView>

      <AuthFooter action="Log in" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  authCardContainer: {
    padding: 10,
    marginTop: 20,
  },
});

export default RegisterOptions;
