import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Button, Text, Icon, BottomSheet} from '@rneui/themed';

import {WINDOW_WIDTH} from '../../utils';
import {useDispatch} from 'react-redux';

import User from '../cards/User';

interface ShareVideoModal {
  isVisible: boolean;
  onClose: () => void;
}

export default ({isVisible, onClose}: ShareVideoModal) => {
  return (
    <BottomSheet
      onBackdropPress={onClose}
      isVisible={isVisible}
      containerStyle={styles.authModalContainer}>
      <View style={styles.container}>
        <Text h4 style={styles.headerText}>
          Share
        </Text>

        <View style={styles.searchContainer}>
          <Text h4>to:</Text>
          <TextInput
            placeholder="search..."
            placeholderTextColor="grey"
            style={styles.searchField}
          />
        </View>
        <TouchableOpacity style={styles.closeModalIcon} onPress={onClose}>
          <Icon name="close-circle-outline" type="ionicon" color="red" />
        </TouchableOpacity>

        <User
          name="Valentine Orga"
          slug="ugo-orga"
          expertise="Software Developer For goats of legend"
          onSelect={(slug: string) => console.log(slug)}
        />

        <View style={styles.footerContainer}>
          <TextInput
            placeholder="write a message"
            placeholderTextColor="grey"
            style={styles.msgField}
          />
          <Button
            title="Send"
            titleStyle={styles.sendBtnTitle}
            containerStyle={styles.sendBtnContainer}
            buttonStyle={styles.sendBtn}
            color="#001433"
          />
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  authModalContainer: {
    justifyContent: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerText: {
    paddingBottom: 10,
  },
  closeModalIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
    width: '100%',
  },
  searchField: {
    flex: 1,
    marginLeft: 10,
    fontSize: WINDOW_WIDTH * 0.045,
    color: 'black',
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  msgField: {width: '90%'},
  sendBtnTitle: {fontSize: WINDOW_WIDTH * 0.04},
  sendBtnContainer: {
    width: '90%',
  },
  sendBtn: {paddingVertical: 15},
});
