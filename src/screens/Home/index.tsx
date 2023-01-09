import React, {useEffect} from 'react';
import {View, Image, StatusBar} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Icon, Badge} from '@rneui/themed';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

import {WINDOW_WIDTH} from '../../utils';

import Inspiring from './Insipiring';
import ForYou from './ForYou';
import {useIsFocused} from '@react-navigation/native';

const HomeTab = createMaterialTopTabNavigator();

const screenOptions = {
  tabBarStyle: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    position: 'absolute',
    left: 75,
    right: 75,
    top: 30,
    height: 50,
    width: 'auto',
    elevation: 0,
  },
  tabBarContentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarIndicatorStyle: {
    backgroundColor: 'white',
    width: 40,
    marginLeft: 35,
  },
  tabBarLabelStyle: {
    textTransform: 'none',
    fontSize: WINDOW_WIDTH * 0.04,
  },
  tabBarActiveTintColor: '#FFFFFF',
  tabBarInactiveTintColor: '#C7C6C7',
};

const HomeTabNavigator = () => {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      changeNavigationBarColor('#001433');
    }
  }, [isFocused]);

  return (
    <View style={{flex: 1}}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="rgba(0,0,0,0)"
      />
      <HomeTab.Navigator
        screenOptions={screenOptions}
        initialRouteName="For You">
        <HomeTab.Screen name="Inspiring" component={Inspiring} />
        <HomeTab.Screen name="For You" component={ForYou} />
      </HomeTab.Navigator>

      <View style={{position: 'absolute', top: 50, left: 10}}>
        <Image
          source={require('../../assets/icons/audio.png')}
          style={{transform: [{scale: WINDOW_WIDTH * 0.002}]}}
        />
        <Badge
          status="error"
          containerStyle={{position: 'absolute', top: 0, left: 20}}
        />
      </View>

      <View style={{position: 'absolute', top: 50, right: 10}}>
        <Icon
          name="chatbox-ellipses"
          color="white"
          type="ionicon"
          size={WINDOW_WIDTH * 0.08}
        />
        <Badge
          status="error"
          containerStyle={{position: 'absolute', top: 0, left: 20}}
        />
      </View>
    </View>
  );
};

export default HomeTabNavigator;
