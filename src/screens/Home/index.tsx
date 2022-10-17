import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import Inspiring from './Insipiring';
import Following from './Following';

const HomeTab = createMaterialTopTabNavigator();

const HomeTabNavigator = () => {
  return (
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
        tabBarLabelStyle: {textTransform: 'none', fontSize: 18},
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#C7C6C7',
      }}>
      <HomeTab.Screen name="Inspiring" component={Inspiring} />
      <HomeTab.Screen name="Following" component={Following} />
    </HomeTab.Navigator>
  );
};

export default HomeTabNavigator;
