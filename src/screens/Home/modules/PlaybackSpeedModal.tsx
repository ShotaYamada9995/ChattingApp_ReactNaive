import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {BottomSheet, Icon} from '@rneui/themed';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils';

interface PlaybackSpeedModalProps {
  isVisible: boolean;
  selectedRate: number;
  onSelect: (rate: number) => void;
  onClose: () => void;
}

export default ({
  isVisible,
  selectedRate,
  onSelect,
  onClose,
}: PlaybackSpeedModalProps) => {
  const rates = [0.25, 0.5, 1, 1.25, 1.5, 1.75, 2];

  const handleOnSelect = (rate: number) => {
    onClose();
    onSelect(rate);
  };

  return (
    <BottomSheet isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.container}>
        {rates.map(rate => (
          <TouchableOpacity
            key={rate}
            style={styles.rateContainer}
            onPress={() => handleOnSelect(rate)}>
            {rate === selectedRate ? (
              <Icon
                name="checkmark-outline"
                type="ionicon"
                size={WINDOW_WIDTH * 0.07}
              />
            ) : (
              <View />
            )}
            <Text style={styles.rate}>
              {rate === 1 ? 'Normal' : `${rate}x`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  rate: {
    color: 'black',
    fontSize: WINDOW_WIDTH * 0.05,
    marginLeft: 20,
  },
});
