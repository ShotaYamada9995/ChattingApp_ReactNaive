import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Icon, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';

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
          size={28}
          onPress={() => navigation.goBack()}
        />

        <Image
          source={require('../../assets/images/logoIcon.png')}
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
    width: 30,
    height: 30,
  },
  title: {
    textAlign: 'center',
  },
  caption: {
    fontSize: 15,
    color: '#aaa',
    textAlign: 'center',
  },
});
