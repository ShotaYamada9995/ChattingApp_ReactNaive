import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Icon, Button, BottomSheet} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {MentionInput} from 'react-native-controlled-mentions';
import CircularProgress from 'react-native-circular-progress-indicator';

import MediaRepository from '../../../repositories/MediaRepository';

import globalStyles from '../../../styles/globalStyles';

import {genFrameAt} from '../../../utils/videoProcessor';

import {addThumbnail} from '../../../store/reducers/Video';

import {useToast} from 'react-native-toast-notifications';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils';

type Viewer = 'Everyone' | 'Friends' | 'Only me';

const PostMedia = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toast = useToast();
  const {user, video} = useSelector((state: any) => ({
    user: state.user,
    video: state.video,
  }));

  const [isUploading, setIsUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [caption, setCaption] = useState('');

  const captionRef = useRef(null);

  const handleOnChangeCaption = (caption: string) => {
    setCaption(caption);
  };

  const addMention = () => {
    setCaption(caption => caption + '@');
  };

  const addHashtag = () => {
    setCaption(caption => caption + '#');
  };

  const postMedia = async () => {
    if (user.isLoggedIn) {
      setIsUploading(true);
      try {
        const tags = caption
          .split(' ')
          .filter(word => word[0] === '#')
          .map(tag => tag.substring(1, tag.length));

        await MediaRepository.uploadMedia(
          {
            token: user.token,
            file: video.path,
            thumbnail: video.thumbnail,
            community: 'music',
            tags,
            text: caption,
            userSlug: user.slug,
          },
          setUploadProgress,
        );

        toast.show('Upload Successful', {
          type: 'success',
          duration: 3000,
        });
      } catch (error) {
        toast.show(
          'Upload could not be completed. Ensure you have a good connection before trying again',
          {
            type: 'danger',
            duration: 3000,
          },
        );
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    } else {
      navigation.navigate('LoginOptions');
    }
  };

  useEffect(() => {
    if (!video.thumbnail) {
      (async () => {
        const frame: string = await genFrameAt(
          0,
          video.path,
          'default_thumbnail',
        );
        dispatch(addThumbnail(frame));
      })();
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[globalStyles.rowLayout, styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Post</Text>
        <View />
      </View>

      <View style={styles.thumbnailContainer}>
        {video.thumbnail ? (
          <Image
            source={{uri: video.thumbnail}}
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator color="white" />
          </View>
        )}

        <TouchableOpacity
          style={styles.selectCoverBtn}
          onPress={() =>
            video.thumbnail ? navigation.navigate('SelectThumbnail') : null
          }>
          <Text style={styles.selectCoverText}>Select cover</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={1}
        style={styles.captionContainer}
        onPress={() => captionRef.current?.focus()}>
        <MentionInput
          inputRef={captionRef}
          multiline
          placeholder="Describe your post, add hashtags or mention creators that inspired you"
          placeholderTextColor="grey"
          value={caption}
          onChange={handleOnChangeCaption}
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

        <View style={styles.captionFooter}>
          <Button
            title="Mention @"
            type="outline"
            buttonStyle={styles.captionFooterBtn}
            titleStyle={styles.captionFooterBtnTxt}
            onPress={addMention}
          />
          <Button
            title="Hashtag #"
            type="outline"
            buttonStyle={styles.captionFooterBtn}
            titleStyle={styles.captionFooterBtnTxt}
            onPress={addHashtag}
          />
        </View>
      </TouchableOpacity>

      <Button
        title="Post"
        containerStyle={styles.postBtn}
        buttonStyle={{paddingVertical: 10, borderColor: '#001433'}}
        color="#001433"
        loading={isUploading}
        disabled={isUploading || (video.thumbnail ? false : true)}
        onPress={postMedia}
      />

      <BottomSheet isVisible={isUploading}>
        <View style={{alignSelf: 'center', marginBottom: 100}}>
          <CircularProgress
            value={uploadProgress}
            radius={WINDOW_WIDTH * 0.2}
            inActiveStrokeOpacity={0.5}
            activeStrokeWidth={15}
            inActiveStrokeWidth={20}
            valueSuffix="%"
            progressValueStyle={{
              fontWeight: 'bold',
              fontSize: WINDOW_WIDTH * 0.1,
              color: 'black',
            }}
            activeStrokeSecondaryColor="yellow"
            inActiveStrokeColor="black"
            dashedStrokeConfig={{
              count: 50,
              width: 4,
            }}
          />
        </View>
      </BottomSheet>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    padding: 10,
    backgroundColor: 'white',
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  headerText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  captionContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    minHeight: WINDOW_HEIGHT * 0.2,
    marginTop: 20,
    borderWidth: 0.5,
    borderColor: '#ccc',
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  captionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
  },
  captionFooterBtn: {
    borderColor: 'black',
    marginLeft: 10,
  },
  captionFooterBtnTxt: {color: 'black', fontSize: WINDOW_WIDTH * 0.04},
  inputField: {fontSize: 16, color: 'black'},
  thumbnailContainer: {
    alignSelf: 'center',
    width: '65%',
    aspectRatio: 9 / 16,
    marginTop: 50,
    backgroundColor: 'black',
  },
  selectCoverBtn: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  selectCoverText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: WINDOW_WIDTH * 0.05,
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  title: {
    color: 'grey',
    fontSize: 15,
    fontWeight: 'bold',
  },
  description: {
    color: 'grey',
    fontSize: 12,
  },
  configLayout: {
    paddingVertical: 10,
    marginTop: 10,
  },
  configEdgeLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#777',
    fontSize: 18,
    marginLeft: 10,
  },
  selectedViewer: {
    fontSize: 15,
    color: '#888',
  },
  postBtn: {
    width: '48%',
    marginTop: 50,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
  bottomSheetView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomSheetViewHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  bottomSheetViewTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  mentionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default PostMedia;
