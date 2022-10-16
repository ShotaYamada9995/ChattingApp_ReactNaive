import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';

interface AuthFooterProps {
  action: string;
}

const AuthFooter = ({action}: AuthFooterProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.footerTop}>
        By continuing, you agree to WhatIdo's{' '}
        <Text style={styles.link} onPress={() => console.log('Terms Bitch!')}>
          Terms of Service
        </Text>{' '}
        and consent that you've read WhatIdo's{' '}
        <Text style={styles.link} onPress={() => console.log('Privacy Bitch!')}>
          Privacy Policy
        </Text>
      </Text>

      <View style={styles.footerBottom}>
        {action === 'Log in' ? (
          <Text style={styles.footerBottomText}>
            Already have an account?{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Login')}>
              {action}
            </Text>
          </Text>
        ) : (
          <Text style={styles.footerBottomText}>
            Don't have an account?{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Register')}>
              {action}
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  link: {
    color: '#0085FF',
  },
  footerTop: {textAlign: 'center', lineHeight: 20, marginHorizontal: 30},
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 30,
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBottomText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default AuthFooter;
