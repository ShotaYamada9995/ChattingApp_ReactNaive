import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Video from 'react-native-video';
import {Icon} from '@rneui/themed';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Slider from 'rn-range-slider';

import {trim, genFrames} from '../../../utils/videoEditor';
import {Frame} from './types';

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
  const videoData = useSelector((state: any) => state.video);
  const {current: video} = useRef(null);

  const [isPaused, setIsPaused] = useState(true);
  const [trims, setTrims] = useState<Trim[]>([]);
  const [activeFrame, setActiveFrame] = useState('');
  const [frames, setFrames] = useState<Frame[]>([]);

  const renderThumb = useCallback(() => <Thumb name="high" />, []);
  const renderRail = useCallback(() => <Rail frames={frames} />, [frames]);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback((value: number) => {
    const duration = Number(value.toFixed(1));

    let time;

    if (duration < 60) {
      time = `${duration}s`;
    } else {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration - minutes * 60);

      const _minutes = `${minutes}`.padStart(2, '0');
      const _seconds = `${seconds}`.padStart(2, '0');

      time = `${_minutes}:${_seconds}`;
    }

    return <Label text={time} />;
  }, []);
  const renderNotch = useCallback(() => <Notch />, []);

  // useEffect(() => {
  //   (async () => {
  //     const frames = await genFrames(videoData);

  //     setFrames(frames);
  //   })();
  // }, []);

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

      <Video
        ref={video}
        source={{uri: videoData.path}}
        style={styles.video}
        paused={false}
      />

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

      {/* {frames.length > 0 ? ( */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sliderContainer}>
        <Slider
          style={[styles.slider, {width: 800}]}
          min={0}
          max={videoData.duration}
          step={0.1}
          floatingLabel
          renderThumb={renderThumb}
          renderRail={renderRail}
          renderRailSelected={renderRailSelected}
          renderLabel={renderLabel}
          renderNotch={renderNotch}
        />
      </ScrollView>
      {/* ) : (
        <ActivityIndicator size="large" />
      )} */}
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
  sliderContainer: {
    paddingHorizontal: 50,
  },
  slider: {
    alignSelf: 'center',
    marginTop: 30,
  },
});

export default Trim;
