import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Slider from 'rn-range-slider';
import Video from 'react-native-video';

import {genFrameAt, genFrames} from '../../../utils/videoProcessor';

import RailSelected from '../Editor/modules/slider/RailSelected';
import Thumb from './modules/slider/Thumb';
import Rail from '../Editor/modules/slider/Rail';
import {WINDOW_WIDTH} from '../../../utils';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {addThumbnail} from '../../../store/reducers/Video';

interface Frame {
  time: number;
  image: string;
}

export default () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const video = useSelector((state: any) => state.video);
  const videoRef = useRef(null);

  const [frames, setFrames] = useState<Frame[]>([]);
  const [frameTime, setFrameTime] = useState<number | null>(null);
  const [isCreatingFrame, setIsCreatingFrame] = useState(false);

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail frames={frames} />, [frames]);
  const renderRailSelected = useCallback(() => <RailSelected />, []);

  const handleDurationChange = (low: number, high: number, byUser: boolean) => {
    if (byUser) {
      const time = Number(low.toFixed(1));
      videoRef.current?.seek(time);
    }
  };

  const handleSlideEnd = (low: number) => {
    const time = Number(low.toFixed(1));
    setFrameTime(time);
  };

  const save = async () => {
    if (frameTime !== null) {
      setIsCreatingFrame(true);

      const frame: string = await genFrameAt(
        frameTime,
        video.path,
        `thumbnail_${Date.now()}`,
      );

      dispatch(addThumbnail(frame));

      navigation.goBack();

      setIsCreatingFrame(false);
    }
  };

  useEffect(() => {
    (async () => {
      const frames: Frame[] = await genFrames(`10/${video.duration}`, video);
      setFrames(frames);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.navBarText}>Cancel</Text>
        </TouchableOpacity>

        {isCreatingFrame ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity onPress={save}>
            <Text
              style={{
                ...styles.navBarText,
                color: frameTime !== null ? 'black' : 'grey',
              }}>
              Save
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isFocused && (
        <Video
          ref={videoRef}
          source={{uri: video.path}}
          style={styles.video}
          paused={true}
        />
      )}

      <Slider
        disableRange
        style={styles.slider}
        min={0}
        max={video.duration}
        step={0.1}
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        onValueChanged={handleDurationChange}
        onSliderTouchEnd={handleSlideEnd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    color: 'black',
  },
  coverImageContainer: {
    alignSelf: 'center',
    width: '65%',
    aspectRatio: 9 / 16,
    marginTop: 10,
    backgroundColor: 'black',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  sliderContainer: {
    paddingHorizontal: WINDOW_WIDTH * 0.3,
    height: 100,
  },
  slider: {
    alignSelf: 'center',
    marginTop: 30,
    width: WINDOW_WIDTH * 0.74,
  },
  sliderThumb: {
    height: 50,
  },
  video: {
    alignSelf: 'center',
    width: '65%',
    aspectRatio: 9 / 16,
    marginTop: 10,
  },
});
