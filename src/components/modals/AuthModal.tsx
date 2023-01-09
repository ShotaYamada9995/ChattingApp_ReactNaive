import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Button, Text, Icon, BottomSheet} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';

import {WINDOW_WIDTH} from '../../utils';
import {useDispatch} from 'react-redux';
import {update} from '../../store/reducers/Login';

interface AuthModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default ({isVisible, onClose}: AuthModalProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleOnPress = () => {
    dispatch(update('Main'));
    navigation.navigate('LoginOptions');
    onClose();
  };
  return (
    <BottomSheet
      onBackdropPress={onClose}
      isVisible={isVisible}
      containerStyle={styles.authModalContainer}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/logo4x.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>
          Log in to follow accounts and like or comment on videos
        </Text>
        <Text style={styles.caption}>
          WhatIDo is more fun when you're in it
        </Text>
        <Button
          title="Log in or sign up"
          titleStyle={{fontSize: WINDOW_WIDTH * 0.04}}
          containerStyle={styles.btn}
          buttonStyle={{paddingVertical: 15}}
          color="#001433"
          onPress={handleOnPress}
        />

        <TouchableOpacity style={styles.closeModalIcon} onPress={onClose}>
          <Icon name="close-outline" type="ionicon" color="black" />
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  authModalContainer: {
    justifyContent: 'center',
  },
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
