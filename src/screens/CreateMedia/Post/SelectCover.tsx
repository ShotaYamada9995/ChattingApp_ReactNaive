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
import Slider from 'rn-range-slider';

import {genFrames} from '../../../utils/videoProcessor';

interface SelectCoverProps {
  defaultCoverImage: string | undefined;
  onCancel: () => void;
}

export default ({defaultCoverImage, onCancel}: SelectCoverProps) => {
  const video = useSelector((state: any) => state.video);
  const [coverImage, setCoverImage] = useState(defaultCoverImage);
  const [frames, setFrames] = useState([]);

  return (
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
    </View>
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
});
