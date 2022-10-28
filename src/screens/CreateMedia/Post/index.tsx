import React, {useState, useRef} from 'react';
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
} from 'react-native';
import {Icon, Button, BottomSheet, CheckBox} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import globalStyles from '../../../styles/globalStyles';

import TagPeople from './TagPeople';

const PostMedia = () => {
  const navigation = useNavigation();
  const [config, setConfig] = useState({
    allowComments: true,
    allowDuet: true,
    allowShare: true,
  });
  const [showViewers, setShowViewers] = useState(false);
  const [showTagScreen, setShowTagScreen] = useState(false);
  const [viewer, setViewer] = useState<'Everyone' | 'Friends' | 'Only me'>(
    'Everyone',
  );

  const caption = useRef(null);

  const toggleComments = () => {
    setConfig(config => ({...config, allowComments: !config.allowComments}));
  };

  const toggleDuet = () => {
    setConfig(config => ({...config, allowDuet: !config.allowDuet}));
  };

  const toggleShare = () => {
    setConfig(config => ({...config, allowShare: !config.allowShare}));
  };

  const selectViewer = viewer => {
    setViewer(viewer);
    setShowViewers(false);
  };

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
        onPress={() => caption.current?.focus()}>
        <View style={styles.captionContainer}>
          <TextInput
            ref={caption}
            multiline
            placeholder="Describe your post, add hashtags or mention creators that inspired you"
            placeholderTextColor="grey"
            style={styles.inputField}
          />
        </View>

        <View style={styles.coverContainer}>
          <TouchableOpacity style={styles.selectCoverBtn}>
            <Text style={styles.selectCoverText}>Select cover</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

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
          <TagPeople onCancel={() => setShowTagScreen(false)} />
        </BottomSheet>

        <TouchableOpacity style={[styles.configLayout, globalStyles.rowLayout]}>
          <View style={styles.configEdgeLayout}>
            <Icon name="location-outline" type="ionicon" />
            <Text style={styles.label}>Location</Text>
          </View>

          <Icon name="chevron-right" color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.configLayout, globalStyles.rowLayout]}
          onPress={() => setShowViewers(true)}>
          <View style={styles.configEdgeLayout}>
            <Icon name="location-outline" type="ionicon" />
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
            <Icon name="chatbubble-ellipses-outline" type="ionicon" />
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
            <Icon name="location-pin" type="fonrawesome" />
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
            <Icon name="location-pin" type="fonrawesome" />
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
  inputField: {fontSize: 16},
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
