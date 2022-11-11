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
import {Slider} from '@miblanchard/react-native-slider';

import {genFrames} from '../../../utils/videoProcessor';

import Notch from '../../../components/slider/Notch';
import RailSelected from '../../../components/slider/RailSelected';
import Thumb from './modules/slider/Thumb';
import Rail from './modules/slider/Rail';
import {WINDOW_HEIGHT} from '../../../utils';

interface SelectCoverProps {
  show: boolean;
  defaultCoverImage: string | undefined;
  onCancel: () => void;
}

export default ({show, defaultCoverImage, onCancel}: SelectCoverProps) => {
  const video = useSelector((state: any) => state.video);
  const [coverImage, setCoverImage] = useState('');
  const [frames, setFrames] = useState([]);

  const renderThumb = useCallback(
    () => (
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: 'cyan',
        }}
      />
    ),
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

        <View style={styles.coverImageContainer}>
          <Image
            source={{uri: defaultCoverImage}}
            style={styles.coverImage}
            resizeMode="contain"
          />
        </View>

        <Slider
          minimumValue={0}
          maximumValue={100}
          onValueChange={value => console.log(value)}
        />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: WINDOW_HEIGHT,
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
