import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Video from 'react-native-video';
import {Icon} from '@rneui/themed';
import {useSelector} from 'react-redux';

import {trim} from '../../../utils/videoEditor';

const Trim = () => {
  const video = useSelector(state => state.video);

  return (
    <View>
      <Text>Trim video</Text>
    </View>
  );
};

export default Trim;
