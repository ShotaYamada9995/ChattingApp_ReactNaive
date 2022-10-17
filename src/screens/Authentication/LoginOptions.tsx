import React, {useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import AuthHeader from '../../components/headers/AuthHeader';
import AuthCard from '../../components/cards/AuthCard';
import AuthFooter from '../../components/footers/AuthFooter';

const LoginOptions = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AuthHeader title="Login" />

      <ScrollView contentContainerStyle={styles.authCardContainer}>
        <AuthCard
          icon="person"
          title="Use Email or Phone"
          onPress={() => navigation.navigate('LoginForm')}
        />

        <AuthCard icon="logo-google" title="Continue with Google" />
        <AuthCard icon="logo-apple" title="Continue with Apple" />
        <AuthCard icon="logo-facebook" title="Continue with Facebook" />
        <AuthCard icon="logo-twitter" title="Continue with Twitter" />
      </ScrollView>

      <AuthFooter action="Sign Up" />
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

export default LoginOptions;
