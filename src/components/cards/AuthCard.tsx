import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Icon, Text} from '@rneui/themed';

interface AuthCardProps {
  icon: any;
  title: string;
  onPress?: any;
}

export default ({icon, title, onPress}: AuthCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name={icon} type="ionicon" size={20} />

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
  icon: {
    width: 20,
    height: 20,
  },
  title: {
    marginLeft: 50,
    fontWeight: 'bold',
  },
});
