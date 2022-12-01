import {Dimensions, Platform} from 'react-native';
import AndroidDimensions from 'react-native-extra-dimensions-android';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

export const WINDOW_HEIGHT =
  Platform.OS === 'android'
    ? AndroidDimensions.getRealWindowHeight() -
      AndroidDimensions.getSoftMenuBarHeight()
    : Dimensions.get('window').height -
      StaticSafeAreaInsets.safeAreaInsetsTop -
      StaticSafeAreaInsets.safeAreaInsetsBottom;

export const WINDOW_WIDTH =
  Platform.OS === 'android'
    ? AndroidDimensions.getRealWindowWidth()
    : Dimensions.get('window').width;
