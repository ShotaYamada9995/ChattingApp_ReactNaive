import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import MiniProfile from './Profiles/MiniProfile';

const ExploreScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Explore</Text>
      {/* <StackNavigation /> */}
      <TouchableOpacity onPress={() => navigation.navigate('MiniProfile')}>
        <Text>Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExploreScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#111',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
