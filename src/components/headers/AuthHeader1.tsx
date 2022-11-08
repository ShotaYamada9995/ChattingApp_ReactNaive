import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Icon, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {WINDOW_WIDTH} from '../../utils';

export default () => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <Icon
        name="arrow-back"
        type="ionicon"
        size={WINDOW_WIDTH * 0.07}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/icons/logo.png')}
          style={styles.logoIcon}
        />
        <Text h4 h4Style={{fontFamily: 'Gilroy-Heavy', fontWeight: 'bold'}}>
          whatido
        </Text>
      </View>

      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: '40%',
    top: 10,
  },
  logoIcon: {
    transform: [{scale: WINDOW_WIDTH * 0.0025}],
  },
});
