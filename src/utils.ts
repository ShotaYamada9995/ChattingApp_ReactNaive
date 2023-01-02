import {Dimensions, Platform} from 'react-native';
import AndroidDimensions from 'react-native-extra-dimensions-android';

export const WINDOW_HEIGHT =
  Platform.OS === 'android'
    ? AndroidDimensions.getRealWindowHeight() +
      AndroidDimensions.getSoftMenuBarHeight()
    : Dimensions.get('window').height;

export const WINDOW_WIDTH =
  Platform.OS === 'android'
    ? AndroidDimensions.getRealWindowWidth()
    : Dimensions.get('window').width;
