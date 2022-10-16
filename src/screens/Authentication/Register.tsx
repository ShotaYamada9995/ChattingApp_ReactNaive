import React, {useEffect} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';

import AuthHeader from '../../components/headers/AuthHeader';
import AuthCard from '../../components/cards/AuthCard';
import AuthFooter from '../../components/footers/AuthFooter';

const Register = () => {
  return (
    <View style={styles.container}>
      <AuthHeader title="Sign Up" />

      <ScrollView contentContainerStyle={styles.authCardContainer}>
        <AuthCard icon="person" title="Use Email or Phone" />
        <AuthCard icon="logo-google" title="Continue with Google" />
        <AuthCard icon="logo-apple" title="Continue with Apple" />
        <AuthCard icon="logo-facebook" title="Continue with Facebook" />
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

export default Register;
