import React, {useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Button, Text, Icon} from '@rneui/themed';

import {WINDOW_WIDTH} from '../../../utils';
import {useNavigation} from '@react-navigation/native';

interface AuthModalProps {
  onCancel: () => void;
}

export default ({onCancel}: AuthModalProps) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logo4x.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>
        Log in to follow accounts and like or comment on videos
      </Text>
      <Text style={styles.caption}>
        WhatIDo is more fun when you sign up so we can make more moneyyyyyyy!!!
      </Text>
      <Button
        title="Log in or sign up"
        titleStyle={{fontSize: WINDOW_WIDTH * 0.04}}
        containerStyle={styles.btn}
        buttonStyle={{paddingVertical: 15}}
        color="#001433"
        onPress={() => {
          navigation.navigate('LoginOptions');
          onCancel();
        }}
      />

      <TouchableOpacity style={styles.closeModalIcon} onPress={onCancel}>
        <Icon name="close-outline" type="ionicon" color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  logo: {
    transform: [{scale: WINDOW_WIDTH * 0.002}],
    height: 100,
  },
  title: {
    fontSize: WINDOW_WIDTH * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: '90%',
  },
  caption: {
    marginVertical: 15,
    maxWidth: '90%',
    fontSize: WINDOW_WIDTH * 0.038,
    color: '#555',
  },
  btn: {
    width: '100%',
  },
  closeModalIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});
