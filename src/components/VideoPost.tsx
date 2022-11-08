import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import React, {useState, useEffect, memo} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import {Icon} from '@rneui/themed';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import {VideoModel} from '../videosData';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useIsForeground} from '../hooks/useIsForeground';
import VideoLoadingIndicator from './shared/VideoLoadingIndicator';

interface VideoPostProps {
  videoItem: any;
  isActive: boolean;
}

const VideoPost = ({videoItem, isActive}: VideoPostProps) => {
  const navigation = useNavigation();

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

  const videoPostHeight =
    Platform.OS === 'ios'
      ? WINDOW_HEIGHT - WINDOW_HEIGHT * 0.1
      : WINDOW_HEIGHT - WINDOW_HEIGHT * 0.104;

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
    const filename: string = encodeURIComponent(
      videoItem.file[0].cdnUrl,
    ).substring(
      encodeURIComponent(videoItem.file[0].cdnUrl)
        .replace(/%3A/g, ':')
        .replace(/%2F/g, '/')
        .lastIndexOf('/') + 1,
      encodeURIComponent(videoItem.file[0].cdnUrl)
        .replace(/%3A/g, ':')
        .replace(/%2F/g, '/').length,
    );
    const path_name = RNFS.DocumentDirectoryPath + '/' + filename;

    // download video
    RNFS.exists(path_name).then(exists => {
      if (exists) {
        getVideoUrl(
          encodeURIComponent(videoItem.file[0].cdnUrl)
            .replace(/%3A/g, ':')
            .replace(/%2F/g, '/'),
          filename,
        )
          .then(res => {
            setVideo(video => ({...video, url: res}));
          })
          .catch(url => {
            setVideo(video => ({...video, url: url}));
          });
      } else {
        RNFS.downloadFile({
          fromUrl: encodeURIComponent(videoItem.file[0].cdnUrl)
            .replace(/%3A/g, ':')
            .replace(/%2F/g, '/'),
          toFile: path_name.replace(/%20/g, '_'),
          background: true,
        })
          .promise.then(res => {
            getVideoUrl(
              encodeURIComponent(videoItem.file[0].cdnUrl)
                .replace(/%3A/g, ':')
                .replace(/%2F/g, '/'),
              filename,
            )
              .then(res => {
                setVideo(video => ({...video, url: res}));
              })
              .catch(url => {
                setVideo(video => ({...video, url: url}));
              });
          })
          .catch(err => {
            setVideo(video => ({
              ...video,
              url: encodeURIComponent(videoItem.file[0].cdnUrl)
                .replace(/%3A/g, ':')
                .replace(/%2F/g, '/'),
            }));
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
    <View style={[styles.container, {height: videoPostHeight}]}>
      {encodeURIComponent(videoItem.file[0].cdnUrl)
        .replace(/%3A/g, ':')
        .replace(/%2F/g, '/') && isFocused ? (
        <Video
          source={{
            uri: encodeURIComponent(videoItem.file[0].cdnUrl)
              .replace(/%3A/g, ':')
              .replace(/%2F/g, '/'),
          }}
          style={styles.video}
          resizeMode="contain"
          paused={video.isPaused || !canPlayVideo}
          onBuffer={data => setIsBuffering(data.isBuffering)}
          repeat
        />
      ) : (
        <VideoLoadingIndicator />
      )}

      {video.isBuffering && (
        <ActivityIndicator
          style={{position: 'absolute', top: '50%', left: '50%'}}
        />
      )}

      <View style={styles.bottomSection}>
        <View style={styles.bottomLeftSection}>
          <View style={styles.videoInfoContainer}>
            <Pressable
              style={styles.videoInfoContainer}
              onPress={() => navigation.navigate('MiniProfile')}>
              <Image
                source={require('../assets/images/profile_picture.webp')}
                style={styles.userPic}
              />
            </Pressable>
            <Text style={styles.username}>Valentine Orga</Text>
            <Pressable onPress={toggleFollow}>
              {isFollowing ? (
                <Text style={styles.followingTag}>following</Text>
              ) : (
                <Text style={styles.followTag}>follow</Text>
              )}
            </Pressable>
          </View>
          <Text style={styles.caption}>{videoItem.text}</Text>
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

export default memo(VideoPost);

const styles = StyleSheet.create({
  container: {
    width: WINDOW_WIDTH,
    backgroundColor: 'black',
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