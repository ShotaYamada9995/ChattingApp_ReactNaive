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
import {useNavigation} from '@react-navigation/native';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils';

interface CommentsProps {
  isVisible: boolean;
  onClose: any;
  videoId: string;
  user: {firstName: string; lastName: string; image: string};
}

export default ({isVisible, onClose, videoId, user}: CommentsProps) => {
  const navigation = useNavigation();

  const [comments, setComments] = useState<any[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);

  return (
    <BottomSheet isVisible={isVisible}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerInfoContainer}
            onPress={() => navigation.navigate('MiniProfile')}>
            {user.image ? (
              <Image source={{uri: user.image}} style={styles.userPic} />
            ) : (
              <Image
                source={require('../../../assets/images/default_profile_image.jpeg')}
                style={styles.userPic}
              />
            )}

            <View>
              <Text style={styles.username}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.userExpertise}>
                expert in web-development
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Icon
              name="close-outline"
              type="ionicon"
              color="grey"
              size={WINDOW_WIDTH * 0.1}
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {comments.map(comment => (
            <View key={comment} style={styles.commentContainer}>
              <Image
                source={require('../../../assets/images/default_profile_image.jpeg')}
                style={styles.userPic}
              />

              <View>
                <Text style={styles.username}>Valentine Orga</Text>
                <Text style={styles.userExpertise}>
                  expert in Software Engineering
                </Text>
                <Text style={styles.comment}>Great video</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerActions}>
            <View style={styles.footerActions}>
              <Icon
                name="bulb-outline"
                type="ionicon"
                color="#888"
                size={WINDOW_WIDTH * 0.07}
              />
              <Text style={styles.footerActionText}>21</Text>
            </View>

            <View style={[styles.footerActions, {marginLeft: 15}]}>
              <Icon
                name="arrow-redo-outline"
                type="ionicon"
                color="#888"
                size={WINDOW_WIDTH * 0.07}
              />
              <Text style={styles.footerActionText}>6</Text>
            </View>
          </View>
          <View style={styles.inputFieldContainer}>
            <TextInput
              placeholder="Add a comment"
              placeholderTextColor="grey"
              style={styles.inputField}
            />
            <Icon
              name="paper-plane-outline"
              type="ionicon"
              color="#888"
              size={WINDOW_WIDTH * 0.08}
              iconStyle={styles.addCommentIcon}
            />
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    height: WINDOW_HEIGHT,
    backgroundColor: 'white',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  headerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
  },
  userPic: {
    width: WINDOW_WIDTH * 0.12,
    height: WINDOW_WIDTH * 0.12,
    borderRadius: 100,
    marginRight: 5,
  },
  username: {
    color: 'black',
    marginRight: 5,
    fontSize: WINDOW_WIDTH * 0.045,
    fontWeight: 'bold',
  },
  userExpertise: {
    color: 'grey',
    fontSize: WINDOW_WIDTH * 0.035,
  },
  footer: {
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerActionText: {
    color: 'black',
    fontSize: WINDOW_WIDTH * 0.04,
    marginLeft: 5,
  },
  inputField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'black',
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentsScrollView: {
    flex: 1,
    backgroundColor: 'cyan',
  },
  commentContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  comment: {
    color: 'black',
    fontSize: WINDOW_WIDTH * 0.045,
  },
  addCommentIcon: {
    margin: 10,
  },
});
