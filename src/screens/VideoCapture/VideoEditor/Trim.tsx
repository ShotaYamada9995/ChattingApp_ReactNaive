import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Video from 'react-native-video';
import {Icon} from '@rneui/themed';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Slider from 'rn-range-slider';

import {trim} from '../../../utils/videoEditor';

import Label from '../../../components/slider/Label';
import Notch from '../../../components/slider/Notch';
import Rail from '../../../components/slider/Rail';
import RailSelected from '../../../components/slider/RailSelected';
import Thumb from '../../../components/slider/Thumb';

interface Trim {
  path: string;
  startTime: string;
  endTime: string;
}

const Trim = () => {
  const navigation = useNavigation();
  const video = useSelector((state: any) => state.video);

  const [isPaused, setIsPaused] = useState(true);
  const [trims, setTrims] = useState<Trim[]>([]);
  const [activeFrame, setActiveFrame] = useState('');

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(value => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.navBarText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.navBarText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Video source={{uri: video.path}} style={styles.video} paused={false} />

      <View style={styles.videoControls}>
        <Text>
          00:00/<Text style={styles.videoTimestamp}>00:00</Text>
        </Text>

        <TouchableOpacity>
          <Icon
            name={isPaused ? 'play' : 'pause'}
            type="ionicon"
            color="white"
            size={20}
            style={{marginRight: 30}}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Icon name="expand" type="ionicon" color="#888" size={20} />
        </TouchableOpacity>
      </View>

      <Slider
        style={styles.slider}
        min={0}
        max={100}
        step={1}
        floatingLabel
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        renderLabel={renderLabel}
        renderNotch={renderNotch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  navBarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  video: {
    alignSelf: 'center',
    width: '65%',
    aspectRatio: 9 / 16,
    marginTop: 10,
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  videoTimestamp: {
    color: '#888',
  },
  slider: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 30,
  },
});

export default Trim;
