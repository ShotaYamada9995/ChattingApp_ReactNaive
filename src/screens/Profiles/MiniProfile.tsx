import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';

const windowHeight = Dimensions.get('window').height;

const MiniProfile = ({navigation}) => {
  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity style={styles.backButton}>
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
    </View>
  );
};

export default MiniProfile;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '100%',
    padding: 16,
    paddingTop: windowHeight / 6,
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
    width: 200,
    height: 200,
    borderRadius: 100,
    margin: 32,
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
    fontSize: 24,
  },
  rating: {
    color: 'white',
    fontSize: 20,
  },
  flagIcon: {
    width: 25,
    height: 20,
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
    fontSize: 16,
  },
  tagSection: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },
  tag: {
    fontSize: 14,
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
    fontSize: 16,
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
    fontSize: 20,
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
    fontSize: 20,
    marginRight: 24,
    marginLeft: 24,
    marginTop: 4,
    marginBottom: 4,
  },
  backButtonIcon: {
    transform: [{rotate: '180deg'}],
    alignSelf: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    alignItem: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 45,
  },
});