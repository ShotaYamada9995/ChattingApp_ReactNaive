import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import DraggableBottomSheet from '../../components/DraggableBottomSheet';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils';

const MiniProfile = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Image
          style={styles.backButtonIcon}
          source={require('../../assets/icons/arrow-forward.png')}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <Image
        source={require('../../assets/images/profile_picture.webp')}
        style={styles.userPic}
      />
      <View style={styles.nameSection}>
        <Text style={styles.userName}>Ghulam Rasool</Text>
        <View style={styles.bigDot} />
        <Text style={styles.rating}> 4.5 ⭐️ </Text>
        <View style={styles.bigDot} />
        <Image
          source={require('../../assets/images/profile_picture.webp')}
          style={styles.flagIcon}
        />
      </View>

      <View style={styles.bioSection}>
        <Text style={styles.bio}>
          Focus on Web Development | Category Loving, caring, goal-oriented
        </Text>
      </View>

      <View style={styles.tagSection}>
        <Text style={styles.tag}>Web Development</Text>
        <Text style={styles.tag}>Piano</Text>
        <Text style={styles.tag}>English</Text>
        <Text style={styles.tag}>Cycling</Text>
      </View>

      <View style={styles.statSection}>
        <View style={styles.statSubSection}>
          <Text style={styles.statText}>Posts</Text>
          <Text style={styles.statText}>200</Text>
        </View>

        <View style={styles.verticalBar} />

        <View style={styles.statSubSection}>
          <Text style={styles.statText}>Followers</Text>
          <Text style={styles.statText}>10.6K</Text>
        </View>

        <View style={styles.verticalBar} />

        <View style={styles.statSubSection}>
          <Text style={styles.statText}>Following</Text>
          <Text style={styles.statText}>6.2K</Text>
        </View>
      </View>

      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
      </View>

      <DraggableBottomSheet />
    </View>
  );
};

export default MiniProfile;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '100%',
    padding: 16,
    paddingTop: WINDOW_HEIGHT / 6,
    alignItems: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#292D32',
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
  userPic: {
    width: WINDOW_WIDTH * 0.5,
    height: WINDOW_WIDTH * 0.5,
    borderRadius: 100,
    marginBottom: 10,
    borderWidth: 5,
    borderColor: 'white',
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bioSection: {
    width: '100%',
    marginTop: 8,
    marginBottom: 8,
  },
  userName: {
    color: 'white',
    fontSize: WINDOW_WIDTH * 0.06,
  },
  rating: {
    color: 'white',
    fontSize: WINDOW_WIDTH * 0.05,
  },
  flagIcon: {
    width: WINDOW_WIDTH * 0.05,
    aspectRatio: 1,
    borderRadius: 3,
  },
  bigDot: {
    height: 7,
    width: 7,
    backgroundColor: 'white',
    margin: 4,
    borderRadius: 5,
  },
  bio: {
    color: 'white',
    fontSize: WINDOW_WIDTH * 0.04,
  },
  tagSection: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },
  tag: {
    fontSize: WINDOW_WIDTH * 0.04,
    margin: 2,
    borderRadius: 5,
    padding: 6,
    backgroundColor: '#CECECE',
  },
  statSection: {
    width: '100%',
    marginTop: 4,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#707275',
    borderRadius: 10,
  },
  verticalBar: {
    width: 2,
    height: 50,
    backgroundColor: 'white',
  },
  statSubSection: {
    margin: 20,
    alignItems: 'center',
  },
  statText: {
    fontSize: WINDOW_WIDTH * 0.04,
    color: 'white',
  },
  buttonSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  followButton: {
    marginTop: 8,
    marginBottom: 8,
    padding: 8,
    color: 'white',
    borderRadius: 5,
    alignSelf: 'flex-end',
    backgroundColor: '#001433',
  },
  followButtonText: {
    color: 'white',
    fontSize: WINDOW_WIDTH * 0.05,
    marginRight: 24,
    marginLeft: 24,
    marginTop: 4,
    marginBottom: 4,
  },
  messageButton: {
    marginTop: 8,
    marginBottom: 8,
    padding: 8,
    color: 'white',
    borderRadius: 5,
    backgroundColor: '#CECECE',
  },
  messageButtonText: {
    color: 'black',
    fontSize: WINDOW_WIDTH * 0.05,
    marginRight: 24,
    marginLeft: 24,
    marginTop: 4,
    marginBottom: 4,
  },
  backButtonIcon: {
    transform: [{rotate: '180deg'}, {scale: WINDOW_WIDTH * 0.003}],
    alignSelf: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    alignItem: 'center',
    justifyContent: 'center',
    height: WINDOW_WIDTH * 0.13,
    width: WINDOW_WIDTH * 0.13,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 45,
  },
});
