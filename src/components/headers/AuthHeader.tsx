import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Icon, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {WINDOW_WIDTH} from '../../utils';

interface AuthHeaderProps {
  title: string;
  caption?: string;
}

export default ({title, caption}: AuthHeaderProps) => {
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.headerContainer}>
        <Icon
          name="arrow-back"
          type="ionicon"
          size={WINDOW_WIDTH * 0.07}
          onPress={() => navigation.goBack()}
        />

        <Image
          source={require('../../assets/icons/logo.png')}
          style={styles.logoIcon}
        />
      </View>
      <Text h3 style={styles.title}>
        {title}
      </Text>
      <Text style={styles.caption}>{caption}</Text>
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
  logoIcon: {
    transform: [{scale: WINDOW_WIDTH * 0.003}],
  },
  title: {
    textAlign: 'center',
    fontFamily: 'Gilroy-Medium',
  },
  caption: {
    fontSize: WINDOW_WIDTH * 0.04,
    color: '#aaa',
    textAlign: 'center',
    fontFamily: 'Gilroy-Regular',
  },
});
