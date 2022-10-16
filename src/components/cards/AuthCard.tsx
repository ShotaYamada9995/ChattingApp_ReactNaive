import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Icon, Text} from '@rneui/themed';

interface AuthCardProps {
  icon: any;
  title: string;
}

export default ({icon, title}: AuthCardProps) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} type="ionicon" size={20} />

      <Text style={styles.title}>{title}</Text>
    </View>
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
