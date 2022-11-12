import React, {useState, useEffect, memo} from 'react';
import {Image, Pressable, StyleSheet, Text, View, Platform} from 'react-native';
import Video from 'react-native-video';
import {Icon} from '@rneui/themed';
import Share from 'react-native-share';

import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useIsForeground} from '../../../hooks/useIsForeground';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import {likeVideo, unlikeVideo} from '../../../store/reducers/InspiringVideos';
import {followUser, unfollowUser} from '../../../store/reducers/User';
import {addBookmark, removeBookmark} from '../../../store/reducers/Bookmarks';

import {useDispatch, useSelector} from 'react-redux';

import MediaRepository from '../../../repositories/MediaRepository';
import UsersRepository from '../../../repositories/UsersRepository';
import PlaybackSpeed from './PlaybackSpeed';

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
    isLoaded: false,
    speed: 1,
  });

  const [showPlaybackSpeed, setShowPlaybackSpeed] = useState(false);

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

  const follow = async () => {
    dispatch(
      followUser({
        following: videoItem.userSlug,
        _id: videoItem.user.id,
        type: 'expert',
      }),
    );

    try {
      await UsersRepository.followUser({
        token: user.token,
        slug: videoItem.userSlug,
        userSlug: user.slug,
        type: 'expert',
      });
    } catch (error) {
      return;
    }
  };

  const unfollow = async () => {
    dispatch(unfollowUser({userSlug: videoItem.userSlug}));

    try {
      await UsersRepository.unfollowUser({
        token: user.token,
        slug: videoItem.userSlug,
        userSlug: user.slug,
        type: 'expert',
      });
    } catch (error) {
      return;
    }
  };

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
          rate={video.speed}
          onLoad={() => setVideo(video => ({...video, isLoaded: true}))}
          repeat
        />
      )} */}

      {/* {!video.isLoaded && (
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
              {videoItem.user.image ? (
                <Image
                  source={{uri: videoItem.user.image}}
                  style={styles.userPic}
                />
              ) : (
                <Image
                  source={require('../../../assets/images/default_profile_image.jpeg')}
                  style={styles.userPic}
                />
              )}
            </Pressable>
            <Pressable onPress={() => navigation.navigate('MiniProfile')}>
              <Text style={styles.username}>
                {videoItem.user.firstName} {videoItem.user.lastName}
              </Text>
            </Pressable>
            {user.isLoggedIn ? (
              user.following.some(
                (user: any) => user.following === videoItem.userSlug,
              ) ? (
                <Text style={styles.followingTag} onPress={unfollow}>
                  following
                </Text>
              ) : (
                <Text style={styles.followTag} onPress={follow}>
                  follow
                </Text>
              )
            ) : null}
          </View>
          <Text style={styles.caption}>{videoItem.text}</Text>
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
            onPress={() =>
              navigation.navigate('Comments', {
                videoId: videoItem._id,
                user: videoItem.user,
              })
            }
          />

          <Icon
            name="arrow-redo"
            type="ionicon"
            color="white"
            style={styles.verticalBarIcon}
            onPress={share}
          />

          <Menu>
            <MenuTrigger>
              <Icon
                name="ellipsis-horizontal"
                type="ionicon"
                color="white"
                style={styles.verticalBarIcon}
              />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption>
                <Text style={styles.menuOption}>Download</Text>
              </MenuOption>
              <MenuOption onSelect={() => setShowPlaybackSpeed(true)}>
                <Text style={styles.menuOption}>Playback speed</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>

          <PlaybackSpeed
            isVisible={showPlaybackSpeed}
            selectedRate={video.speed}
            onSelect={(rate: number) =>
              setVideo(current => ({...current, speed: rate}))
            }
            onClose={() => setShowPlaybackSpeed(false)}
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
    backgroundColor: '#001433',
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
  menuOption: {
    padding: 10,
    color: 'black',
  },
});
