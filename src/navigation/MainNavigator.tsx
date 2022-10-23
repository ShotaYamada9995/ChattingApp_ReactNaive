import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon} from '@rneui/themed';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';

import Home from '../screens/Home';
import ExploreScreen from '../screens/ExploreScreen';
import AudioRoomScreen from '../screens/AudioRoomScreen';
import ChatScreen from '../screens/Chats';
import VideoCapture from '../screens/VideoCapture';

const MainTab = createBottomTabNavigator();

const Main = () => {
  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarStyle: {backgroundColor: '#001433', borderTopWidth: 0},
        headerShown: false,
        tabBarActiveTintColor: 'white',
      }}>
      <MainTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon name="home" color={focused ? 'white' : 'grey'} />
          ),
        }}
      />
      <MainTab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="compass"
              type="ionicon"
              color={focused ? 'white' : 'grey'}
            />
          ),
        }}
      />
      <MainTab.Screen
        name="VideoCapture"
        component={VideoCapture}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused}) => (
            <LinearGradient
              colors={['#FDD819', '#E80505']}
              start={{x: 0.5, y: 0}}
              style={styles.postIcon}>
              <Icon name="add" color="white" size={25} />
            </LinearGradient>
          ),
        }}
      />
      <MainTab.Screen
        name="Notification"
        component={AudioRoomScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon name="notifications" color={focused ? 'white' : 'grey'} />
          ),
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ChatScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon name="person" color={focused ? 'white' : 'grey'} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};

export default Main;

const styles = StyleSheet.create({
  bottomTabIcon: {
    width: 20,
    height: 20,
    tintColor: 'grey',
  },
  bottomTabIconFocused: {
    tintColor: 'white',
  },
  postIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    height: 55,
    borderRadius: 30,
    marginTop: -50,
  },
});
