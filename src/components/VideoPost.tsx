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
import Share from 'react-native-share';

import {VideoModel} from '../videosData';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useIsForeground} from '../hooks/useIsForeground';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {likeVideo, unlikeVideo} from '../store/reducers/InspiringVideos';
import {addBookmark, removeBookmark} from '../store/reducers/Bookmarks';

import {useDispatch, useSelector} from 'react-redux';

import MediaRepository from '../repositories/MediaRepository';

interface VideoPostProps {
  videoItem: any;
  isActive: boolean;
}

const VideoPost = ({videoItem, isActive}: VideoPostProps) => {
  const {user, bookmarks} = useSelector((state: any) => ({
    user: state.user,
    bookmarks: state.bookmarks,
  }));
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [video, setVideo] = useState({
    url: '',
    isBuffering: false,
    isPaused: true,
    isLiked: false,
    isBookmarked: false,
    isLoaded: false,
  });

  const [isFollowing, setIsFollowing] = useState(false);

  const isForeGround = useIsForeground();
  const isFocused = useIsFocused();
  const canPlayVideo = isForeGround && isFocused;

  const videoPostHeight =
    Platform.OS === 'ios'
      ? WINDOW_HEIGHT - WINDOW_HEIGHT * 0.1
      : WINDOW_HEIGHT - WINDOW_HEIGHT * 0.104;

  const videoUrl = encodeURIComponent(videoItem.file[0].cdnUrl)
    .replace(/%3A/g, ':')
    .replace(/%2F/g, '/');

  const togglePause = () => {
    setVideo(video => ({...video, isPaused: !video.isPaused}));
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const like = async () => {
    if (user.isLoggedIn) {
      dispatch(likeVideo({id: videoItem._id, username: user.slug}));

      try {
        await MediaRepository.likeVideo({
          id: videoItem._id,
          userSlug: user.slug,
        });
      } catch (error) {
        return;
      }
    } else {
      navigation.navigate('LoginOptions');
    }
  };

  const unlike = async () => {
    if (user.isLoggedIn) {
      dispatch(unlikeVideo({id: videoItem._id, username: user.slug}));

      try {
        await MediaRepository.unlikeVideo({
          id: videoItem._id,
          userSlug: user.slug,
        });
      } catch (error) {
        return;
      }
    } else {
      navigation.navigate('LoginOptions');
    }
  };

  const share = async () => {
    const options = {
      message: videoItem.text,
      url: videoUrl,
    };

    togglePause();

    Share.open(options)
      .then(res => {
        return;
      })
      .catch(err => {
        return;
      })
      .finally(() => togglePause());
  };

  // const getVideoUrl = (url: string, filename: string) => {
  //   return new Promise((resolve, reject) => {
  //     RNFS.readDir(RNFS.DocumentDirectoryPath)
  //       .then(result => {
  //         result.forEach(element => {
  //           if (element.name == filename.replace(/%20/g, '_')) {
  //             resolve(element.path);
  //           }
  //         });
  //       })
  //       .catch(err => {
  //         reject(url);
  //       });
  //   });
  // };

  // const setVideoUrl = () => {
  //   const filename: string = encodeURIComponent(
  //     videoItem.file[0].cdnUrl,
  //   ).substring(
  //     encodeURIComponent(videoItem.file[0].cdnUrl)
  //       .replace(/%3A/g, ':')
  //       .replace(/%2F/g, '/')
  //       .lastIndexOf('/') + 1,
  //     encodeURIComponent(videoItem.file[0].cdnUrl)
  //       .replace(/%3A/g, ':')
  //       .replace(/%2F/g, '/').length,
  //   );
  //   const path_name = RNFS.DocumentDirectoryPath + '/' + filename;

  //   // download video
  //   RNFS.exists(path_name).then(exists => {
  //     if (exists) {
  //       getVideoUrl(
  //         encodeURIComponent(videoItem.file[0].cdnUrl)
  //           .replace(/%3A/g, ':')
  //           .replace(/%2F/g, '/'),
  //         filename,
  //       )
  //         .then(res => {
  //           setVideo(video => ({...video, url: res}));
  //         })
  //         .catch(url => {
  //           setVideo(video => ({...video, url: url}));
  //         });
  //     } else {
  //       RNFS.downloadFile({
  //         fromUrl: encodeURIComponent(videoItem.file[0].cdnUrl)
  //           .replace(/%3A/g, ':')
  //           .replace(/%2F/g, '/'),
  //         toFile: path_name.replace(/%20/g, '_'),
  //         background: true,
  //       })
  //         .promise.then(res => {
  //           getVideoUrl(
  //             encodeURIComponent(videoItem.file[0].cdnUrl)
  //               .replace(/%3A/g, ':')
  //               .replace(/%2F/g, '/'),
  //             filename,
  //           )
  //             .then(res => {
  //               setVideo(video => ({...video, url: res}));
  //             })
  //             .catch(url => {
  //               setVideo(video => ({...video, url: url}));
  //             });
  //         })
  //         .catch(err => {
  //           setVideo(video => ({
  //             ...video,
  //             url: encodeURIComponent(videoItem.file[0].cdnUrl)
  //               .replace(/%3A/g, ':')
  //               .replace(/%2F/g, '/'),
  //           }));
  //         });
  //     }
  //   });
  // };

  useEffect(() => {
    if (isActive) {
      setVideo(video => ({...video, isPaused: false}));
    } else {
      setVideo(video => ({...video, isPaused: true}));
    }
  }, [isActive]);

  return (
    <View
      style={[
        styles.container,
        {height: videoPostHeight + (WINDOW_WIDTH * 0.15) / 2},
      ]}>
      {/* {isFocused && (
        <Video
          poster={videoItem.thumbnail[0].cdnUrl}
          posterResizeMode="cover"
          source={{
            uri: videoUrl,
          }}
          style={styles.video}
          resizeMode="cover"
          paused={video.isPaused || !canPlayVideo}
          playInBackground={false}
          onLoad={() => setVideo(video => ({...video, isLoaded: true}))}
          repeat
        />
      )}

      {!video.isLoaded && (
        <View style={{position: 'absolute', width: '100%', height: '100%'}}>
          <Image
            source={{uri: videoItem.thumbnail[0].cdnUrl}}
            style={{width: '100%', height: '100%'}}
          />
        </View>
      )} */}

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
            <Text style={styles.username}>
              {videoItem.userProfile.firstName} {videoItem.userProfile.lastName}
            </Text>
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
            <Text style={styles.viewsCount}>{videoItem.inspired_count}</Text>
          </View>
        </View>

        <View style={styles.bottomRightSection}>
          {bookmarks.some((video: any) => video._id === videoItem._id) ? (
            <Icon
              name="bookmark"
              type="ionicon"
              color="white"
              style={styles.verticalBarIcon}
              onPress={() => dispatch(removeBookmark({id: videoItem._id}))}
            />
          ) : (
            <Icon
              name="bookmark-outline"
              type="ionicon"
              color="white"
              style={styles.verticalBarIcon}
              onPress={() => dispatch(addBookmark(videoItem))}
            />
          )}

          {!user.isLoggedIn || !videoItem.inspired.includes(user?.slug) ? (
            <Icon
              name="heart"
              type="ionicon"
              color="white"
              style={styles.verticalBarIcon}
              onPress={like}
            />
          ) : (
            <Icon
              name="heart"
              type="ionicon"
              color="red"
              style={styles.verticalBarIcon}
              onPress={unlike}
            />
          )}

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
            onPress={share}
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
    width: '100%',
    backgroundColor: 'black',
  },
  thumbnail: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
