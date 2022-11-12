import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import Slider from 'rn-range-slider';

import {genFrames} from '../../../utils/videoProcessor';

import Notch from '../Editor/modules/slider/Notch';
import RailSelected from '../Editor/modules/slider/RailSelected';
import Thumb from './modules/slider/Thumb';
import Rail from './modules/slider/Rail';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils';
import {useNavigation} from '@react-navigation/native';
import {addThumbnail} from '../../../store/reducers/Video';

interface Frame {
  time: number;
  image: string;
}

export default () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const video = useSelector((state: any) => state.video);
  const [coverImage, setCoverImage] = useState('');
  const [thumbImage, setThumbImage] = useState('');
  const [frames, setFrames] = useState<Frame[] | undefined>([]);

  const renderThumb = useCallback(
    () => <Thumb image={thumbImage || video.thumbnail} />,
    [thumbImage],
  );
  const renderRail = useCallback(() => <Rail frames={frames} />, [frames]);
  const renderRailSelected = useCallback(() => <RailSelected />, []);

  const handleSlideChange = (low: number, high: number, byUser: boolean) => {
    if (byUser) {
      const frame = frames.find(frame => frame.time === low);
      setCoverImage(frame.image);
    }
  };

  const handleSlideEnd = () => {
    setThumbImage(coverImage);
  };

  const save = () => {
    dispatch(addThumbnail({thumbnail: coverImage}));
    navigation.goBack();
  };

  useEffect(() => {
    (async () => {
      const frames: Frame[] = await genFrames(video);
      setFrames(frames);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.navBarText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={save}>
          <Text style={styles.navBarText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.coverImageContainer}>
        <Image
          source={{uri: coverImage || video.thumbnail}}
          style={styles.coverImage}
          resizeMode="contain"
        />
      </View>

      {frames && frames.length > 1 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sliderContainer}>
          <Slider
            disableRange
            style={[styles.slider, {width: 30 * frames.length}]}
            min={1}
            max={frames.length}
            step={1}
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            onValueChanged={handleSlideChange}
            onSliderTouchEnd={handleSlideEnd}
          />
        </ScrollView>
      ) : frames?.length === 1 ? (
        <Text style={{color: 'black', textAlign: 'center', marginTop: 20}}>
          No thumbnails to select from
        </Text>
      ) : (
        <ActivityIndicator style={{marginTop: 20}} />
      )}
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
    paddingHorizontal: 50,
    paddingVertical: 0,
    margin: 0,
  },
  slider: {
    alignSelf: 'center',
    marginTop: 30,
    width: '80%',
  },
  sliderThumb: {
    height: 50,
  },
});
