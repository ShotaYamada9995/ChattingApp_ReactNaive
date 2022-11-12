import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {Icon} from '@rneui/themed';
import {useNavigation, useRoute} from '@react-navigation/native';
import {WINDOW_WIDTH} from '../../../utils';
import MediaRepository from '../../../repositories/MediaRepository';
import {useSelector} from 'react-redux';
import {MentionInput} from 'react-native-controlled-mentions';
import {useToast} from 'react-native-toast-notifications';

export default () => {
  const navigation = useNavigation();
  const route = useRoute();
  const toast = useToast();

  const accountUser = useSelector((state: any) => state.user);

  const {videoId, user} = route.params;

  const [comments, setComments] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isAddingComments, setIsAddingComments] = useState(false);
  const [comment, setComment] = useState('');

  const currentPage = useRef(0);

  const handleOnChangeCaption = (comment: string) => {
    if (accountUser.isLoggedIn) {
      // if (comment[comment.length - 1] === '@') {
      //   setShowMentions(true);
      // } else if (showMentions) {
      //   setShowMentions(false);
      // }

      // if (comment[comment.length - 1] === '#') {
      //   setShowHashtags(true);
      // } else if (showHashtags) {
      //   setShowHashtags(false);
      // }

      setComment(comment);
    } else {
      navigation.navigate('LoginOptions');
    }
  };

  const addComment = async () => {
    if (accountUser.isLoggedIn) {
      setIsAddingComments(true);

      try {
        const payload = {
          mediaId: videoId,
          text: comment,
          userSlug: accountUser.slug,
          mediaCommentId: '',
        };
        const response = await MediaRepository.addComment(payload);

        console.log(response.data);
      } catch (error) {
        console.log('Error adding comment');
        console.error(error);
        toast.show('Failed to add comment', {
          type: 'danger',
          duration: 2000,
        });
      } finally {
        setIsAddingComments(false);
      }
    } else {
      navigation.navigate('LoginOptions');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const {data: comments} = await MediaRepository.getComments({
          id: videoId,
          page: currentPage.current,
        });

        setIsLoadingComments(false);
        setComments(comments);
        currentPage.current++;
      } catch (error) {
        console.log('Error getting comments');
        console.error(error);
      }
    })();
  }, []);

  return (
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
            {/* <Text style={styles.userExpertise}>expert</Text> */}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
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
          <View key={comment._id} style={styles.commentContainer}>
            <Image
              source={{uri: comment.user[0].imageUrl.cdnUrl}}
              style={styles.userPic}
            />

            <View>
              <Text style={styles.username}>
                {comment.user[0].profile.firstName}{' '}
                {comment.user[0].profile.lastName}
              </Text>
              {/* <Text style={styles.userExpertise}>
                expert in Software Engineering
              </Text> */}
              <Text style={styles.comment}>{comment.text}</Text>
            </View>
          </View>
        ))}

        {isLoadingComments && (
          <ActivityIndicator
            size="large"
            style={{alignSelf: 'center', marginVertical: 10}}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        {/* <View style={styles.footerActions}>
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
        </View> */}
        <KeyboardAvoidingView behavior="position">
          <View style={styles.inputFieldContainer}>
            <MentionInput
              multiline
              placeholder="Add a comment"
              placeholderTextColor="grey"
              value={comment}
              onChange={handleOnChangeCaption}
              containerStyle={{flex: 1}}
              style={styles.inputField}
              partTypes={[
                {
                  pattern: /(?<=#).*?(?=( |$))/g,
                  textStyle: {fontWeight: 'bold'},
                },
                {
                  pattern: /(?<=@).*?(?=( |$))/g,
                  textStyle: {fontWeight: 'bold'},
                },
              ]}
            />
            {isAddingComments ? (
              <ActivityIndicator size="large" style={{margin: 10}} />
            ) : (
              <Icon
                name="paper-plane-outline"
                type="ionicon"
                color="#888"
                size={WINDOW_WIDTH * 0.08}
                iconStyle={styles.addCommentIcon}
                onPress={addComment}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: '100%',
    // borderTopWidth: 0.5,
    // borderTopColor: '#ccc',
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
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'black',
  },
  commentsScrollView: {
    flex: 1,
    backgroundColor: 'cyan',
  },
  commentContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    width: '90%',
  },
  comment: {
    color: 'black',
    fontSize: WINDOW_WIDTH * 0.045,
  },
  addCommentIcon: {
    margin: 10,
  },
});
