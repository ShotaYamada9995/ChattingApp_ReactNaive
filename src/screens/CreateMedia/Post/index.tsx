import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {Icon, Button, BottomSheet, CheckBox, Avatar} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {MentionInput} from 'react-native-controlled-mentions';
import {Video as VideoCompressor} from 'react-native-compressor';

import MediaRepository from '../../../repositories/MediaRepository';

import globalStyles from '../../../styles/globalStyles';

import {genFrameAt} from '../../../utils/videoProcessor';

import {addThumbnail} from '../../../store/reducers/Video';

import TagPeople from './TagPeople';
import {useToast} from 'react-native-toast-notifications';

type Viewer = 'Everyone' | 'Friends' | 'Only me';

const PostMedia = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toast = useToast();
  const {user, video} = useSelector((state: any) => ({
    user: state.user,
    video: state.video,
  }));

  const [config, setConfig] = useState({
    allowComments: true,
    allowDuet: true,
    allowShare: true,
  });
  const [showSelectCoverImage, setShowSelectCoverImage] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const [showTagScreen, setShowTagScreen] = useState(false);
  const [showHashtags, setShowHashtags] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const [viewer, setViewer] = useState<Viewer>('Everyone');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState([]);
  const [mentions, setMentions] = useState<any[]>([
    {_id: 1},
    {_id: 2},
    {_id: 3},
    {_id: 4},
    {_id: 5},
    {_id: 6},
    {_id: 7},
    {_id: 8},
    {_id: 9},
  ]);

  const captionRef = useRef(null);

  const toggleComments = () => {
    setConfig(config => ({...config, allowComments: !config.allowComments}));
  };

  const toggleDuet = () => {
    setConfig(config => ({...config, allowDuet: !config.allowDuet}));
  };

  const toggleShare = () => {
    setConfig(config => ({...config, allowShare: !config.allowShare}));
  };

  const selectViewer = (viewer: Viewer) => {
    setViewer(viewer);
    setShowViewers(false);
  };

  const handleOnChangeCaption = (caption: string) => {
    if (caption[caption.length - 1] === '@') {
      setShowMentions(true);
    } else if (showMentions) {
      setShowMentions(false);
    }

    if (caption[caption.length - 1] === '#') {
      setShowHashtags(true);
    } else if (showHashtags) {
      setShowHashtags(false);
    }

    setCaption(caption);
  };

  const postMedia = async () => {
    setIsPosting(true);
    try {
      const compressedVideo = await VideoCompressor.compress(
        video.path,
        {compressionMethod: 'auto'},
        progress => {
          console.log(`Compression Progress: ${Math.round(progress * 100)}%`);
        },
      );

      const tags = caption
        .split(' ')
        .filter(word => word[0] === '#')
        .map(tag => tag.substring(1, tag.length));

      const response = await MediaRepository.uploadMedia({
        token: user.token,
        file: compressedVideo,
        thumbnail: video.thumbnail,
        community: 'music',
        tags,
        text: caption,
        userSlug: user.slug,
      });

      toast.show('Upload Successful', {
        type: 'success',
        duration: 2000,
      });

      console.log('Upload: ', response.data);
    } catch (error) {
      console.log('Error posting video');
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    // TO-DO: Remove conditional
    (async () => {
      const frame: string = await genFrameAt(
        0,
        video.path,
        'default_thumbnail',
      );
      dispatch(addThumbnail(frame));
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[globalStyles.rowLayout, styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Post</Text>
        <View />
      </View>

      <TouchableOpacity
        activeOpacity={1}
        style={styles.captionCoverContaienr}
        onPress={() => captionRef.current?.focus()}>
        <View style={styles.captionContainer}>
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
        </View>

        <View style={styles.coverContainer}>
          {video.thumbnail ? (
            <Image
              source={{uri: video.thumbnail}}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          ) : null}

          {!video.thumbnail ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator color="white" />
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.selectCoverBtn}
            onPress={() =>
              video.thumbnail ? navigation.navigate('SelectThumbnail') : null
            }>
            <Text style={styles.selectCoverText}>Select cover</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {showMentions ? (
        <KeyboardAvoidingView style={{flex: 1}} behavior="position">
          <FlatList
            keyExtractor={(item, index) => item._id}
            data={mentions}
            renderItem={item => (
              <TouchableOpacity
                style={styles.mentionsContainer}
                onPress={() => {
                  setCaption(caption => caption + 'ValentineOrga');
                  setShowMentions(false);
                }}>
                <Avatar
                  source={require('../../../assets/images/profile_picture.webp')}
                  rounded
                  size="medium"
                />

                <View style={{marginLeft: 10}}>
                  <Text style={styles.title}>Valentine Orga</Text>
                  <Text style={styles.description}>@ValentineOrga</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </KeyboardAvoidingView>
      ) : showHashtags ? (
        <FlatList
          keyExtractor={(item, index) => item._id}
          data={mentions}
          renderItem={item => (
            <TouchableOpacity
              style={{padding: 10, width: '100%'}}
              onPress={() => {
                setCaption(caption => caption + 'WhatIDo');
                setShowHashtags(false);
              }}>
              <Text style={styles.title}>#WhatIDo</Text>
              <Text style={styles.description}>Lots of Tweets</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
          <TouchableOpacity
            style={[styles.configLayout, globalStyles.rowLayout]}
            onPress={() => setShowTagScreen(true)}>
            <View style={styles.configEdgeLayout}>
              {/* <Icon name="person-outline" type="ionicon" /> */}
              <Text style={styles.label}>Tag people</Text>
            </View>

            <Icon name="chevron-right" color="black" />
          </TouchableOpacity>

          <TagPeople
            show={showTagScreen}
            tags={tags}
            setTags={setTags}
            onCancel={() => setShowTagScreen(false)}
          />

          {user.isLoggedIn && (
            <TouchableOpacity
              style={[styles.configLayout, globalStyles.rowLayout]}>
              <View style={styles.configEdgeLayout}>
                {/* <Icon name="location-outline" type="ionicon" /> */}
                <Text style={styles.label}>Location</Text>
              </View>

              <Icon name="chevron-right" color="black" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.configLayout, globalStyles.rowLayout]}
            onPress={() => setShowViewers(true)}>
            <View style={styles.configEdgeLayout}>
              {/* <Icon name="location-outline" type="ionicon" /> */}
              <Text style={styles.label}>Who can watch this video?</Text>
            </View>

            <View style={styles.configEdgeLayout}>
              <Text style={styles.selectedViewer}>{viewer}</Text>
              <Icon name="chevron-right" color="black" />
            </View>
          </TouchableOpacity>

          <BottomSheet
            onBackdropPress={() => setShowViewers(false)}
            isVisible={showViewers}>
            <View style={styles.bottomSheetView}>
              <View
                style={[styles.bottomSheetViewHeader, globalStyles.rowLayout]}>
                <View />
                <Text style={styles.bottomSheetViewTitle}>Tags</Text>

                <TouchableOpacity onPress={() => setShowViewers(false)}>
                  <Icon name="close-outline" type="ionicon" size={30} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={globalStyles.rowLayout}
                onPress={() => selectViewer('Everyone')}>
                <Text style={styles.label}>Everyone</Text>
                <CheckBox checked={viewer === 'Everyone'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={globalStyles.rowLayout}
                onPress={() => selectViewer('Friends')}>
                <Text style={styles.label}>Friends</Text>
                <CheckBox checked={viewer === 'Friends'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={globalStyles.rowLayout}
                onPress={() => selectViewer('Only me')}>
                <Text style={styles.label}>Only me</Text>
                <CheckBox checked={viewer === 'Only me'} />
              </TouchableOpacity>
            </View>
          </BottomSheet>

          <View style={[styles.configLayout, globalStyles.rowLayout]}>
            <View style={styles.configEdgeLayout}>
              {/* <Icon name="chatbubble-ellipses-outline" type="ionicon" /> */}
              <Text style={styles.label}>Allow Comments</Text>
            </View>

            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor="#001433"
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleComments}
              value={config.allowComments}
            />
          </View>

          {/* <View style={[styles.configLayout, globalStyles.rowLayout]}>
            <View style={styles.configEdgeLayout}>
              <Icon name="location-pin" type="fonrawesome" />
              <Text style={styles.label}>Allow Duet</Text>
            </View>

            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor="#001433"
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleDuet}
              value={config.allowDuet}
            />
          </View> */}

          <View style={[styles.configLayout, globalStyles.rowLayout]}>
            <View style={styles.configEdgeLayout}>
              {/* <Icon name="location-pin" type="fonrawesome" /> */}
              <Text style={styles.label}>Allow Share</Text>
            </View>

            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor="#001433"
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleShare}
              value={config.allowShare}
            />
          </View>
        </KeyboardAvoidingView>
      )}

      <Button
        title="Post"
        containerStyle={styles.btn}
        buttonStyle={{paddingVertical: 10, borderColor: '#001433'}}
        color="#001433"
        loading={isPosting}
        disabled={isPosting || (video.thumbnail ? false : true)}
        onPress={postMedia}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  header: {
    paddingVertical: 5,
  },
  headerText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  captionCoverContaienr: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: '20%',
  },
  captionContainer: {
    flex: 2,
  },
  inputField: {fontSize: 16, color: 'black'},
  coverContainer: {
    flex: 1,
    backgroundColor: 'black',
    aspectRatio: 3 / 4,
  },
  selectCoverBtn: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  selectCoverText: {
    color: 'white',
    fontWeight: 'bold',
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
  btn: {
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
