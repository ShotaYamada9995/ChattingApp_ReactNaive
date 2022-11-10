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
} from 'react-native';
import {Icon, Button, BottomSheet, CheckBox} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {MentionInput} from 'react-native-controlled-mentions';
import {Video as VideoCompressor} from 'react-native-compressor';

import MediaRepository from '../../../repositories/MediaRepository';

import globalStyles from '../../../styles/globalStyles';

import {genFirstFrame} from '../../../utils/videoProcessor';

import TagPeople from './TagPeople';
import SelectCover from './SelectCover';

type Viewer = 'Everyone' | 'Friends' | 'Only me';

const PostMedia = () => {
  const navigation = useNavigation();
  const {user, video} = useSelector((state: any) => ({
    user: state.user,
    video: state.video,
  }));

  const [coverImage, setCoverImage] = useState<string>('');
  const [config, setConfig] = useState({
    allowComments: true,
    allowDuet: true,
    allowShare: true,
  });
  const [showSelectCoverImage, setShowSelectCoverImage] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const [showTagScreen, setShowTagScreen] = useState(false);
  const [viewer, setViewer] = useState<Viewer>('Everyone');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState([]);

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
    setCaption(caption);
  };

  const postMedia = async () => {
    try {
      const compressedVideo = await VideoCompressor.compress(
        video.path,
        {compressionMethod: 'auto'},
        progress => {
          console.log('Compression Progress: ', progress);
        },
      );

      const tags = caption
        .split(' ')
        .filter(word => word[0] === '#')
        .map(tag => tag.substring(1, tag.length));

      const upload = await MediaRepository.uploadMedia({
        token: user.token,
        file: compressedVideo,
        thumbnail: coverImage,
        community: 'music',
        tags,
        text: caption,
        userSlug: user.slug,
      });

      console.log('Upload: ', upload);
    } catch (error) {
      console.log('Error posting video');
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      const frame: string = await genFirstFrame(video.path);
      setCoverImage(frame);
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
          {coverImage ? (
            <Image
              source={{uri: coverImage}}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          ) : null}

          {!coverImage ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator color="white" />
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.selectCoverBtn}
            onPress={() => (coverImage ? setShowSelectCoverImage(true) : null)}>
            <Text style={styles.selectCoverText}>Select cover</Text>
          </TouchableOpacity>
        </View>

        {/* {!coverImage ? ( */}

        {/* ) : null} */}
      </TouchableOpacity>

      <BottomSheet
        onBackdropPress={() => setShowSelectCoverImage(false)}
        isVisible={showSelectCoverImage}>
        <SelectCover
          defaultCoverImage={coverImage}
          onCancel={() => setShowSelectCoverImage(false)}
        />
      </BottomSheet>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
        <TouchableOpacity
          style={[styles.configLayout, globalStyles.rowLayout]}
          onPress={() => setShowTagScreen(true)}>
          <View style={styles.configEdgeLayout}>
            <Icon name="person-outline" type="ionicon" />
            <Text style={styles.label}>Tag people</Text>
          </View>

          <Icon name="chevron-right" color="black" />
        </TouchableOpacity>

        <BottomSheet
          onBackdropPress={() => setShowTagScreen(false)}
          isVisible={showTagScreen}>
          <TagPeople
            tags={tags}
            setTags={setTags}
            onCancel={() => setShowTagScreen(false)}
          />
        </BottomSheet>
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
              <Text style={styles.bottomSheetViewTitle}>
                Who can watch this video
              </Text>

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
            thumbColor="#f5dd4b"
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleComments}
            value={config.allowComments}
          />
        </View>

        <View style={[styles.configLayout, globalStyles.rowLayout]}>
          <View style={styles.configEdgeLayout}>
            {/* <Icon name="location-pin" type="fonrawesome" /> */}
            <Text style={styles.label}>Allow Duet</Text>
          </View>

          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor="#f5dd4b"
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDuet}
            value={config.allowDuet}
          />
        </View>

        <View style={[styles.configLayout, globalStyles.rowLayout]}>
          <View style={styles.configEdgeLayout}>
            {/* <Icon name="location-pin" type="fonrawesome" /> */}
            <Text style={styles.label}>Allow Share</Text>
          </View>

          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor="#f5dd4b"
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleShare}
            value={config.allowShare}
          />
        </View>
      </KeyboardAvoidingView>

      <Button
        title="Post"
        containerStyle={styles.btn}
        buttonStyle={{paddingVertical: 10, borderColor: '#001433'}}
        color="#001433"
        disabled={coverImage ? false : true}
        // onPress={postMedia}
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
});

export default PostMedia;
