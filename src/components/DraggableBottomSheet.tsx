import React, {useRef} from 'react';
import {View, Text, StyleSheet, Animated, PanResponder} from 'react-native';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils';
import {Button, Icon} from '@rneui/themed';

const MAX_HEIGHT = WINDOW_HEIGHT - 10;
const MAX_UPWARD_TRANSLATE_Y = -MAX_HEIGHT;
const MAX_DOWNWARD_TRANSLATE_Y = 0;
const DRAG_THRESHOLD = 100;

export default () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        animatedValue.setOffset(lastGestureDy.current);
      },
      onPanResponderMove: (e, gesture) => {
        animatedValue.setValue(gesture.dy);
      },
      onPanResponderRelease: (e, gesture) => {
        animatedValue.flattenOffset();

        if (gesture.dy > 0) {
          if (gesture.dy <= DRAG_THRESHOLD) {
            springAnimation('up');
          } else {
            springAnimation('down');
          }
        } else {
          if (gesture.dy >= -DRAG_THRESHOLD) {
            springAnimation('down');
          } else {
            springAnimation('up');
          }
        }
      },
    }),
  ).current;

  const springAnimation = (direction: 'up' | 'down') => {
    lastGestureDy.current =
      direction === 'down' ? MAX_DOWNWARD_TRANSLATE_Y : MAX_UPWARD_TRANSLATE_Y;

    Animated.spring(animatedValue, {
      toValue: lastGestureDy.current,
      useNativeDriver: true,
    }).start();
  };

  const bottomSheetAnimation = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          outputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.container, bottomSheetAnimation]}>
      <View style={styles.dragHandle} {...panResponder.panHandlers}>
        <Text style={styles.dragHandleText}>Slide up to view profile</Text>
        <Icon name="chevron-down" type="ionicon" color="white" />
      </View>

      <View style={{position: 'absolute', bottom: 0}}>
        {/* Press to close profile */}
        <Button title="Close" onPress={() => springAnimation('down')} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: WINDOW_WIDTH,
    height: MAX_HEIGHT,
    bottom: -MAX_HEIGHT,
    backgroundColor: 'white',
  },
  dragHandle: {
    width: '100%',
    height: 32,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -32,
  },
  dragHandleText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
