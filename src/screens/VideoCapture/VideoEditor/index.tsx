import React, {useEffect, useState, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import Video from 'react-native-video';
import {Icon, Button} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const VideoEditor = () => {
  const navigation = useNavigation();
  const video = useSelector(state => state.video);

  return (
    <View style={styles.container}>
      <Video
        source={{uri: video.path}}
        style={styles.video}
        resizeMode="cover"
        repeat
      />

      <TouchableOpacity
        style={styles.navIcon}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" color="white" />
      </TouchableOpacity>

      <View style={styles.sideBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Trim')}>
          <Icon name="flash" type="ionicon" color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.btnContainer}>
        <Button
          title="Your Story"
          containerStyle={styles.btn}
          buttonStyle={{paddingVertical: 10, borderColor: '#001433'}}
          titleStyle={{color: '#001433'}}
          color="white"
        />
        <Button
          title="Next"
          containerStyle={styles.btn}
          buttonStyle={{paddingVertical: 10}}
          color="#001433"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  navIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  sideBar: {position: 'absolute', top: 20, right: 10},
  btnContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  btn: {
    width: '48%',
    marginTop: 50,
    alignSelf: 'center',
  },
});

export default VideoEditor;
