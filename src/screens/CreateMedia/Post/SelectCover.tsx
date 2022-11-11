import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {BottomSheet} from '@rneui/themed';
import Slider from 'rn-range-slider';

import {genFrames} from '../../../utils/videoProcessor';

import Notch from '../../../components/slider/Notch';
import RailSelected from '../../../components/slider/RailSelected';
import Thumb from './modules/slider/Thumb';
import Rail from './modules/slider/Rail';

interface SelectCoverProps {
  show: boolean;
  defaultCoverImage: string | undefined;
  onCancel: () => void;
}

export default ({show, defaultCoverImage, onCancel}: SelectCoverProps) => {
  const video = useSelector((state: any) => state.video);
  const [coverImage, setCoverImage] = useState(defaultCoverImage);
  const [frames, setFrames] = useState([]);

  const renderThumb = useCallback(
    () => <Thumb image={`${coverImage}`} />,
    [coverImage],
  );
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);

  return (
    <BottomSheet isVisible={show}>
      <View style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.navBarText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.navBarText}>Save</Text>
          </TouchableOpacity>
        </View>

        {!!coverImage && (
          <View style={styles.coverImageContainer}>
            <Image
              source={{uri: coverImage}}
              style={styles.coverImage}
              resizeMode="contain"
            />
          </View>
        )}

        {/* <Slider
        disableRange
        style={styles.slider}
        min={0}
        max={100}
        step={1}
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        // onValueChanged
        // onSliderTouchEnd={handleOnSlideTouchEnd}
      /> */}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
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
  slider: {
    alignSelf: 'center',
    marginTop: 30,
    width: '50%',
  },
});
