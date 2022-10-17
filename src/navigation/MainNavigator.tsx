import React from 'react';
import {Image, StyleSheet} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from '../screens/Home';
import ExploreScreen from '../screens/ExploreScreen';
import PostScreen from '../screens/Post';
import AudioRoomScreen from '../screens/AudioRoomScreen';
import ChatScreen from '../screens/Chats';

const MainTab = createBottomTabNavigator();

const Main = () => {
  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarStyle: {backgroundColor: 'black'},
        headerShown: false,
        tabBarActiveTintColor: 'white',
      }}>
      <MainTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/images/home.png')}
              style={[
                styles.bottomTabIcon,
                focused && styles.bottomTabIconFocused,
              ]}
            />
          ),
        }}
      />
      <MainTab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/images/search.png')}
              style={[
                styles.bottomTabIcon,
                focused && styles.bottomTabIconFocused,
              ]}
            />
          ),
        }}
      />
      <MainTab.Screen
        name="Post"
        component={PostScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/images/new-video.png')}
              style={[
                styles.newVideoButton,
                focused && styles.bottomTabIconFocused,
              ]}
            />
          ),
        }}
      />
      <MainTab.Screen
        name="Audio Room"
        component={AudioRoomScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/images/message.png')}
              style={[
                styles.bottomTabIcon,
                focused && styles.bottomTabIconFocused,
              ]}
            />
          ),
        }}
      />
      <MainTab.Screen
        name="Chats"
        component={ChatScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/images/user.png')}
              style={[
                styles.bottomTabIcon,
                focused && styles.bottomTabIconFocused,
              ]}
            />
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
  newVideoButton: {
    width: 48,
    height: 24,
  },
});
