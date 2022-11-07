import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import globalStyles from '../../styles/globalStyles';
import {WINDOW_WIDTH} from '../../utils';

interface AuthFooterProps {
  action: string;
}

const AuthFooter = ({action}: AuthFooterProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.footerTopText}>
        By continuing, you agree to WhatIdo's{' '}
        <Text
          style={styles.link}
          onPress={() => console.log('My App, My Terms!')}>
          Terms of Service
        </Text>{' '}
        and consent that you've read WhatIdo's{' '}
        <Text
          style={styles.link}
          onPress={() => console.log('Your Data, Your Privacy!')}>
          Privacy Policy
        </Text>
      </Text>

      <View style={styles.footerBottom}>
        {action === 'Log in' ? (
          <Text style={styles.footerBottomText}>
            Already have an account?{' '}
            <Text
              style={globalStyles.link}
              onPress={() => navigation.navigate('LoginOptions')}>
              {action}
            </Text>
          </Text>
        ) : (
          <Text style={styles.footerBottomText}>
            Don't have an account?{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('RegisterOptions')}>
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
  footerTopText: {
    textAlign: 'center',
    lineHeight: 20,
    marginHorizontal: 30,
    fontSize: WINDOW_WIDTH * 0.04,
    fontFamily: 'Gilroy-Medium',
  },
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
    fontSize: WINDOW_WIDTH * 0.05,
    fontFamily: 'Gilroy-Medium',
  },
});

export default AuthFooter;
