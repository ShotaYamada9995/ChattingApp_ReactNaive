import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  memo,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import {Icon} from '@rneui/themed';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import Slider from 'rn-range-slider';

import {trim, genFrames} from '../../../utils/videoProcessor';
import {mmssTimeFormat, hhmmssTimeFormat} from '../../../utils/helpers';
import {Frame} from './types';

import Label from './modules/slider/Label';
import Notch from './modules/slider/Notch';
import Rail from './modules/slider/Rail';
import RailSelected from './modules/slider/RailSelected';
import Thumb from './modules/slider/Thumb';

import {update} from '../../../store/reducers/Video';
import {WINDOW_WIDTH} from '../../../utils';

interface Trim {
  startTime: number;
  endTime: number;
}

const Trim = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const videoData = useSelector((state: any) => state.video);
  const video = useRef(null);
  const duration = useRef({startTime: 0, endTime: videoData.duration});

  const [isPaused, setIsPaused] = useState(true);
  const [isTrimming, setIsTrimming] = useState(false);
  const [trims, setTrims] = useState<Trim[]>([]);
  const [activeTrimIndex, setActiveTrimIndex] = useState(0);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [slider, setSlider] = useState({
    low: 0,
    high: videoData.duration,
  });
  const [time, setTime] = useState(0);

  const handleDurationChange = (low: number, high: number, byUser: boolean) => {
    if (byUser) {
      const startTime = Number(low.toFixed(1));
      const endTime = Number(high.toFixed(1));

      if (startTime !== duration.current.startTime) {
        video.current?.seek(startTime);
      }

      if (endTime !== duration.current.endTime) {
        video.current?.seek(endTime);
      }

      if (endTime - startTime >= 1) {
        duration.current = {startTime, endTime};
      }
    }
  };

  const handleOnSlideTouchEnd = (low: number, high: number) => {
    const startTime = Number(low.toFixed(1));
    const endTime = Number(high.toFixed(1));

    if (endTime - startTime < 1) {
      Alert.alert('Clip must be 1 second or more');
    } else {
      setTrims(trims => [...trims, duration.current]);
      setActiveTrimIndex(trims.length);
      setSlider({
        low: duration.current.startTime,
        high: duration.current.endTime,
      });
      if (!isPaused) {
        setIsPaused(true);
      }
    }
  };

  const togglePlay = () => {
    if (isPaused) {
      video.current?.seek(duration.current.startTime);
    }
    setIsPaused(current => !current);
  };

  const handleVideoProgress = (data: any) => {
    setTime(data.currentTime);
    if (data.currentTime >= duration.current.endTime) {
      setIsPaused(true);
    }
  };

  const selectPrevTrim = () => {
    if (activeTrimIndex !== 0) {
      const trim = trims[activeTrimIndex - 1];
      setActiveTrimIndex(activeTrimIndex - 1);
      setSlider({
        low: trim.startTime,
        high: trim.endTime,
      });
      video.current?.seek(trim.startTime);
      setIsPaused(true);
      duration.current = trim;
    }
  };

  const selectNextTrim = () => {
    if (activeTrimIndex !== trims.length - 1) {
      const trim = trims[activeTrimIndex + 1];
      setActiveTrimIndex(activeTrimIndex + 1);
      setSlider({
        low: trim.startTime,
        high: trim.endTime,
      });
      video.current?.seek(trim.startTime);
      setIsPaused(true);
      duration.current = trim;
    }
  };

  const renderDuration = () => {
    if (trims.length === 0) return;

    const trim = trims[activeTrimIndex];
    const _time = mmssTimeFormat(Math.abs(time - trim.startTime));
    const _duration = mmssTimeFormat(trim.endTime - trim.startTime);

    return (
      <Text style={styles.timeStampContainer}>
        {_time}/<Text style={styles.videoTimestamp}>{_duration}</Text>
      </Text>
    );
  };

  const renderThumb = useCallback(() => <Thumb name="high" />, []);
  const renderRail = useCallback(() => <Rail frames={frames} />, [frames]);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(
    (seconds: number) => <Label text={mmssTimeFormat(seconds)} />,
    [],
  );
  const renderNotch = useCallback(() => <Notch />, []);

  const save = async () => {
    if (trims.length > 1 && activeTrimIndex > 0) {
      try {
        setIsTrimming(true);
        const _trim = trims[activeTrimIndex];
        const video = {
          path: videoData.path,
          startTime: hhmmssTimeFormat(_trim.startTime),
          endTime: hhmmssTimeFormat(_trim.endTime),
        };

        const newPath = await trim(video);

        dispatch(
          update({
            path: newPath,
            duration: _trim.endTime - _trim.startTime,
          }),
        );

        navigation.goBack();
      } catch (error) {
        console.error(error);
      } finally {
        setIsTrimming(false);
      }
    } else {
      Alert.alert('No trims yet');
    }
  };

  useEffect(() => {
    setTrims([{startTime: 0, endTime: Number(videoData.duration.toFixed(1))}]);
    (async () => {
      const frames = await genFrames(`10/${videoData.duration}`, videoData);
      setFrames(frames);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.navBarText}>Cancel</Text>
        </TouchableOpacity>

        {isTrimming ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity onPress={save}>
            <Text
              style={{
                ...styles.navBarText,
                color: activeTrimIndex > 0 ? 'white' : 'grey',
              }}>
              Save
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isFocused && (
        <Video
          ref={video}
          source={{uri: videoData.path}}
          style={styles.video}
          paused={isPaused}
          onProgress={handleVideoProgress}
          onEnd={() => setIsPaused(true)}
        />
      )}

      <View style={styles.videoControls}>
        {renderDuration()}

        <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
          <Icon
            name={isPaused ? 'play' : 'pause'}
            type="ionicon"
            color="white"
            size={25}
          />
        </TouchableOpacity>
        {trims.length > 1 ? (
          <View style={styles.trimNavContainer}>
            <TouchableOpacity onPress={selectPrevTrim}>
              <Icon
                name="arrow-back"
                color={activeTrimIndex === 0 ? 'grey' : 'white'}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={selectNextTrim}>
              <Icon
                name="arrow-forward"
                style={{marginLeft: 5}}
                color={activeTrimIndex === trims.length - 1 ? 'grey' : 'white'}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
      </View>

      <Slider
        style={styles.slider}
        min={0}
        max={videoData.duration}
        low={slider.low}
        high={slider.high}
        step={0.1}
        floatingLabel
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        renderLabel={renderLabel}
        renderNotch={renderNotch}
        onValueChanged={handleDurationChange}
        onSliderTouchEnd={handleOnSlideTouchEnd}
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
  timestampContainer: {textAlign: 'left'},
  videoTimestamp: {
    color: '#888',
  },
  playBtn: {
    position: 'absolute',
    right: '48%',
  },
  trimNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sliderContainer: {
    paddingHorizontal: WINDOW_WIDTH * 0.3,
    height: 100,
    marginTop: 20,
  },
  slider: {
    alignSelf: 'center',
    marginTop: 30,
    width: WINDOW_WIDTH * 0.74,
  },
});

export default Trim;
