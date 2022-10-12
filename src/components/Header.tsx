import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Icon, Text} from '@rneui/themed';

interface Props {
  height: number;
}

const Header = ({height}: Props) => {
  return (
    <View style={{...styles.container, height}}>
      <View>
        <Text style={styles.logoText}>what i do</Text>
      </View>

      <View style={styles.actions}>
        <Icon name="notifications" size={30} style={{marginRight: 20}} />
        <Icon
          name="wallet"
          type="ionicon"
          size={30}
          style={{marginRight: 20}}
        />
        <Image
          source={require('../assets/images/profile_picture.webp')}
          style={styles.profilePic}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  logoText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {},
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
});

export default Header;
