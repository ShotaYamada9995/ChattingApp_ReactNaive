import React from 'react';
import {View, Image} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Icon, Badge} from '@rneui/themed';
import {WINDOW_WIDTH} from '../../utils';

import Inspiring from './Insipiring';
import Following from './Following';

const HomeTab = createMaterialTopTabNavigator();

const HomeTabNavigator = () => {
  return (
    <View style={{flex: 1}}>
      <HomeTab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            position: 'absolute',
            left: 75,
            right: 75,
            top: 0,
            height: 50,
            width: 200,
            elevation: 0,
          },
          tabBarIndicatorStyle: {
            backgroundColor: 'white',
            width: 40,
            marginLeft: 30,
          },
          tabBarLabelStyle: {
            textTransform: 'none',
            fontSize: WINDOW_WIDTH * 0.04,
          },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#C7C6C7',
        }}>
        <HomeTab.Screen name="Inspiring" component={Inspiring} />
        <HomeTab.Screen name="For You" component={Following} />
      </HomeTab.Navigator>

      <View style={{position: 'absolute', top: 20, left: 10}}>
        <Image
          source={require('../../assets/icons/audio.png')}
          style={{transform: [{scale: WINDOW_WIDTH * 0.002}]}}
        />
        <Badge
          status="error"
          containerStyle={{position: 'absolute', top: 0, left: 20}}
        />
      </View>

      <View style={{position: 'absolute', top: 20, right: 10}}>
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
