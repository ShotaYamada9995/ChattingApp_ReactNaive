import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FullProfile from '../screens/Profiles/FullProfile';
import MiniProfile from '../screens/Profiles/MiniProfile';
const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MiniProfile" component={MiniProfile} />
        <Stack.Screen name="FullProfile" component={FullProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
