import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import React, {useState, useEffect, memo} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import {Icon} from '@rneui/themed';

import {VideoModel} from '../videosData';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useIsForeground} from '../hooks/useIsForeground';
import VideoLoadingIndicator from './shared/VideoLoadingIndicator';

interface PostProps {
  data: VideoModel;
  isActive: boolean;
}

const Post = ({data, isActive}: PostProps) => {
  const navigation = useNavigation();
  const {uri, caption, channelName, musicName, likes, comments, avatarUri} =
    data;

  const [video, setVideo] = useState({
    url: '',
    isBuffering: false,
    isPaused: true,
    isLiked: false,
    isBookmarked: false,
  });

  const [isFollowing, setIsFollowing] = useState(false);

  const bottomTabHeight = useBottomTabBarHeight();

  const isForeGround = useIsForeground();
  const isFocused = useIsFocused();
  const canPlayVideo = isForeGround && isFocused;

  const togglePause = () => {
    setVideo(video => ({...video, isPaused: !video.isPaused}));
  };

  const toggleLike = () => {
    setVideo(video => ({...video, isLiked: !video.isLiked}));
  };
  const toggleBookmark = () => {
    setVideo(video => ({...video, isBookmarked: !video.isBookmarked}));
  };

  const setIsBuffering = (isBuffering: boolean) => {
    setVideo(video => ({...video, isBuffering}));
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const getVideoUrl = (url: string, filename: string) => {
    return new Promise((resolve, reject) => {
      RNFS.readDir(RNFS.DocumentDirectoryPath)
        .then(result => {
          result.forEach(element => {
            if (element.name == filename.replace(/%20/g, '_')) {
              resolve(element.path);
            }
          });
        })
        .catch(err => {
          reject(url);
        });
    });
  };

  const setVideoUrl = () => {
    const filename: string = uri.substring(
      uri.lastIndexOf('/') + 1,
      uri.length,
    );
    const path_name = RNFS.DocumentDirectoryPath + '/' + filename;

    // download video
    RNFS.exists(path_name).then(exists => {
      if (exists) {
        getVideoUrl(uri, filename)
          .then(res => {
            setVideo(video => ({...video, url: res}));
          })
          .catch(url => {
            setVideo(video => ({...video, url: url}));
          });
      } else {
        RNFS.downloadFile({
          fromUrl: uri,
          toFile: path_name.replace(/%20/g, '_'),
          background: true,
        })
          .promise.then(res => {
            getVideoUrl(uri, filename)
              .then(res => {
                setVideo(video => ({...video, url: res}));
              })
              .catch(url => {
                setVideo(video => ({...video, url: url}));
              });
          })
          .catch(err => {
            setVideo(video => ({...video, url: uri}));
          });
      }
    });
  };

  useEffect(() => {
    setVideoUrl();
    if (isActive) {
      setVideo(video => ({...video, isPaused: false}));
    } else {
      setVideo(video => ({...video, isPaused: true}));
    }
  }, [isActive]);
  return (
    <View style={[styles.container, {height: WINDOW_HEIGHT - bottomTabHeight}]}>
      {video.url && canPlayVideo ? (
        <Video
          source={{uri: video.url}}
          style={styles.video}
          resizeMode="cover"
          paused={video.isPaused || !canPlayVideo}
          onBuffer={data => setIsBuffering(data.isBuffering)}
          repeat
        />
      ) : (
        <VideoLoadingIndicator />
      )}

      {video.isBuffering && (
        <ActivityIndicator style={{position: 'absolute', top: 5, left: 5}} />
      )}

      <View style={styles.bottomSection}>
        <View style={styles.bottomLeftSection}>
          <View style={styles.videoInfoContainer}>
            <Image
              source={require('../assets/images/profile_picture.webp')}
              style={styles.userPic}
            />
            <Text style={styles.username}>Valentine Orga</Text>
            <Pressable onPress={toggleFollow}>
              {isFollowing ? (
                <Text style={styles.followingTag}>following</Text>
              ) : (
                <Text style={styles.followTag}>follow</Text>
              )}
            </Pressable>
          </View>
          <Text style={styles.caption}>{caption}</Text>
          <Text>#cute #dog</Text>
          <View style={styles.videoInfoContainer}>
            <Icon
              name={video.isPaused ? 'play' : 'pause'}
              type="ionicon"
              color="white"
              size={20}
              onPress={togglePause}
            />
            <Text style={styles.viewsCount}>25k</Text>
          </View>
        </View>

        <View style={styles.bottomRightSection}>
          <Icon
            name={video.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            type="ionicon"
            color="white"
            style={styles.verticalBarIcon}
            onPress={toggleBookmark}
          />
          <Icon
            name="heart"
            type="ionicon"
            color={video.isLiked ? 'red' : 'white'}
            style={styles.verticalBarIcon}
            onPress={toggleLike}
          />
          <Icon
            name="chatbubbles"
            type="ionicon"
            color="white"
            style={styles.verticalBarIcon}
          />
          <Icon
            name="arrow-redo"
            type="ionicon"
            color="white"
            style={styles.verticalBarIcon}
          />
          <Icon
            name="ellipsis-horizontal"
            type="ionicon"
            color="white"
            style={styles.verticalBarIcon}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(Post);

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 8,
    paddingBottom: 16,
    alignItems: 'flex-end',
  },
  bottomLeftSection: {
    flex: 4,
  },
  bottomRightSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
  channelName: {
    color: 'white',
    fontWeight: 'bold',
  },
  caption: {
    color: 'white',
    marginVertical: 8,
  },
  videoInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPic: {
    width: 30,
    height: 30,
    borderRadius: 100,
    marginRight: 5,
  },
  username: {
    color: 'white',
    marginRight: 5,
  },
  followingTag: {
    borderWidth: 0.5,
    borderColor: 'white',
    paddingHorizontal: 5,
  },
  followTag: {
    paddingHorizontal: 5,
    backgroundColor: 'blue',
    color: 'white',
  },
  viewsCount: {color: 'white'},
  musicDisc: {
    width: 40,
    height: 40,
  },
  verticalBar: {
    position: 'absolute',
    right: 8,
    bottom: 72,
  },
  verticalBarItem: {
    marginBottom: 24,
    alignItems: 'center',
  },
  verticalBarIcon: {
    marginBottom: 20,
  },
  verticalBarText: {
    color: 'white',
    marginTop: 4,
  },
  avatarContainer: {
    marginBottom: 48,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  followButton: {
    position: 'absolute',
    bottom: -8,
  },
  followIcon: {
    width: 21,
    height: 21,
  },
  floatingMusicNote: {
    position: 'absolute',
    right: 40,
    bottom: 16,
    width: 16,
    height: 16,
    tintColor: 'white',
  },
});
