import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Icon, Text} from '@rneui/themed';
import {WINDOW_WIDTH} from '../../utils';

interface AuthCardProps {
  icon: any;
  title: string;
  onPress?: any;
}

export default ({icon, title, onPress}: AuthCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name={icon} type="ionicon" size={WINDOW_WIDTH * 0.05} />

      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    backgroundColor: '#F1F1F1',
  },
  title: {
    marginLeft: 50,
    fontWeight: 'bold',
    fontSize: WINDOW_WIDTH * 0.04,
    fontFamily: 'Gilroy-Medium',
  },
});
