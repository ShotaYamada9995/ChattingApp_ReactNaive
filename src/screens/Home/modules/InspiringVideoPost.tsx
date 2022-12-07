import React, {useState, useEffect, useMemo, memo} from 'react';
import {Image, Pressable, StyleSheet, Text, View, Platform} from 'react-native';
import {Icon} from '@rneui/themed';
import Share from 'react-native-share';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import Video from 'react-native-video';

import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils';

import {useIsForeground} from '../../../hooks/useIsForeground';

import {likeVideo, unlikeVideo} from '../../../store/reducers/InspiringVideos';
import {followUser, unfollowUser} from '../../../store/reducers/User';
import {addBookmark, removeBookmark} from '../../../store/reducers/Bookmarks';

import MediaRepository from '../../../repositories/MediaRepository';
import UsersRepository from '../../../repositories/UsersRepository';

import PlaybackSpeedModal from './PlaybackSpeedModal';

interface VideoPostProps {
  id: string;
  videoSource: string;
  thumbnailSource: string;
  caption: string;
  inspiredCount: number;
  userSlug: string;
  userImage: string;
  userFirstname: string;
  userLastname: string;
  isLiked: boolean;
  isActive: boolean;
}

export const VIDEO_POST_HEIGHT =
  Platform.OS === 'ios'
    ? WINDOW_HEIGHT - WINDOW_HEIGHT * 0.07
    : WINDOW_HEIGHT - WINDOW_HEIGHT * 0.104;

const VideoPost = ({
  id,
  videoSource,
  thumbnailSource,
  caption,
  inspiredCount,
  userSlug,
  userImage,
  userFirstname,
  userLastname,
  isLiked,
  isActive,
}: VideoPostProps) => {
  const {user, bookmarks} = useSelector((state: any) => ({
    user: state.user,
    bookmarks: state.bookmarks,
  }));
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [video, setVideo] = useState({
    isPaused: true,
    speed: 1,
  });
  const [showPlaybackSpeedModal, setShowPlaybackSpeedModal] = useState(false);

  const isForeGround = useIsForeground();
  const isFocused = useIsFocused();
  const canPlayVideo = isForeGround && isFocused;
  const isVideoPaused = video.isPaused || !canPlayVideo;

  const videoUrl = encodeURIComponent(videoSource)
    .replace(/%3A/g, ':')
    .replace(/%2F/g, '/');

  const togglePause = () => {
    setVideo(video => ({...video, isPaused: !video.isPaused}));
  };

  const like = async () => {
    if (user.isLoggedIn) {
      dispatch(likeVideo({id, username: user.slug}));

      try {
        await MediaRepository.likeVideo(user.token, {
          id,
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
      dispatch(unlikeVideo({id, username: user.slug}));

      try {
        await MediaRepository.unlikeVideo(user.token, {
          id,
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
      message: caption,
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
    dispatch(followUser({userSlug}));

    try {
      await UsersRepository.followUser({
        token: user.token,
        slug: userSlug,
        userSlug: user.slug,
        type: 'expert',
      });
    } catch (error) {
      return;
    }
  };

  const unfollow = async () => {
    dispatch(unfollowUser({userSlug: userSlug}));

    try {
      await UsersRepository.unfollowUser({
        token: user.token,
        slug: userSlug,
        userSlug: user.slug,
        type: 'expert',
      });
    } catch (error) {
      return;
    }
  };

  const BookmarkIcon = useMemo(
    () =>
      bookmarks.some((video: any) => video.id === id) ? (
        <Pressable onPress={() => dispatch(removeBookmark({id}))}>
          <Icon
            name="bookmark"
            type="ionicon"
            color="white"
            style={styles.verticalBarIcon}
          />
        </Pressable>
      ) : (
        <Pressable
          onPress={() =>
            dispatch(
              addBookmark({
                id,
                video: videoSource,
                thumbnail: thumbnailSource,
                caption,
                inspiredCount,
                user: {
                  slug: userSlug,
                  image: userImage,
                  firstname: userFirstname,
                  lastname: userLastname,
                },
              }),
            )
          }>
          <Icon
            name="bookmark-outline"
            type="ionicon"
            color="white"
            style={styles.verticalBarIcon}
          />
        </Pressable>
      ),
    [bookmarks],
  );

  const LikeIcon = () =>
    isLiked ? (
      <Pressable onPress={unlike}>
        <Icon
          name="heart"
          type="ionicon"
          color="red"
          style={styles.verticalBarIcon}
        />
      </Pressable>
    ) : (
      <Pressable onPress={like}>
        <Icon
          name="heart"
          type="ionicon"
          color="white"
          style={styles.verticalBarIcon}
        />
      </Pressable>
    );

  const UserImage = useMemo(
    () =>
      userImage ? (
        <Image source={{uri: userImage}} style={styles.userPic} />
      ) : (
        <Image
          source={require('../../../assets/images/default_profile_image.jpeg')}
          style={styles.userPic}
        />
      ),
    [userImage],
  );

  const PlaybackSpeedModalComp = useMemo(
    () => (
      <PlaybackSpeedModal
        isVisible={showPlaybackSpeedModal}
        selectedRate={video.speed}
        onSelect={(rate: number) =>
          setVideo(current => ({...current, speed: rate}))
        }
        onClose={() => setShowPlaybackSpeedModal(false)}
      />
    ),
    [showPlaybackSpeedModal, video.speed],
  );

  const VideoPlayer = useMemo(
    () =>
      isFocused && (
        <Video
          poster={thumbnailSource}
          posterResizeMode="cover"
          source={{
            uri: videoUrl,
          }}
          style={styles.video}
          resizeMode="cover"
          paused={isVideoPaused}
          playInBackground={false}
          rate={video.speed}
          repeat
          onTouchStart={togglePause}
        />
      ),
    [video.speed, isVideoPaused, isFocused, videoUrl, thumbnailSource],
  );

  useEffect(() => {
    setVideo(video => ({...video, isPaused: !isActive}));
  }, [isActive]);

  return (
    <View style={styles.container}>
      {VideoPlayer}

      <View style={styles.bottomSection}>
        <View style={styles.bottomLeftSection}>
          <View style={styles.videoInfoContainer}>
            <Pressable onPress={() => navigation.navigate('MiniProfile')}>
              {UserImage}
            </Pressable>
            <Pressable onPress={() => navigation.navigate('MiniProfile')}>
              <Text style={styles.username}>
                {userFirstname} {userLastname}
              </Text>
            </Pressable>
            {user.isLoggedIn &&
              user.slug !== userSlug &&
              (user.following.includes(userSlug) ? (
                <Text style={styles.followingTag} onPress={unfollow}>
                  following
                </Text>
              ) : (
                <Text style={styles.followTag} onPress={follow}>
                  follow
                </Text>
              ))}
          </View>
          <Text style={styles.caption}>{caption}</Text>
          <View style={styles.videoInfoContainer}>
            <Icon
              name={video.isPaused ? 'play' : 'pause'}
              type="ionicon"
              color="white"
              size={20}
              onPress={togglePause}
            />
            <Text style={styles.viewsCount}>{inspiredCount}</Text>
          </View>
        </View>

        <View style={styles.bottomRightSection}>
          {BookmarkIcon}

          {LikeIcon()}

          <Pressable
            onPress={() =>
              navigation.navigate('Comments', {
                videoId: id,
                user: {
                  image: userImage,
                  firstName: userFirstname,
                  lastName: userLastname,
                },
              })
            }>
            <Image
              style={styles.commentBtn}
              source={require('../../../assets/icons/comment.png')}
              resizeMode="cover"
            />
          </Pressable>

          <Pressable onPress={share}>
            <Image
              style={styles.shareBtn}
              source={require('../../../assets/icons/arrow-forward.png')}
              resizeMode="cover"
            />
          </Pressable>

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
              {/* <MenuOption>
                <Text style={styles.menuOption}>Download</Text>
              </MenuOption> */}
              <MenuOption onSelect={() => setShowPlaybackSpeedModal(true)}>
                <Text style={styles.menuOption}>Playback speed</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>

          {PlaybackSpeedModalComp}
        </View>
      </View>
    </View>
  );
};

export default memo(VideoPost);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(60,60,60,0.5)',
    height: VIDEO_POST_HEIGHT,
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
    backgroundColor: 'rgba(60,60,60,0.5)',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 8,
    paddingBottom: 20,
    alignItems: 'flex-end',
  },
  bottomLeftSection: {
    flex: 4,
    paddingBottom: 15,
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
    color: 'white',
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
  commentBtn: {
    transform: [{scale: WINDOW_WIDTH * 0.0018}],
    marginBottom: 20,
  },
  shareBtn: {
    transform: [{scale: WINDOW_WIDTH * 0.0025}],
    marginBottom: 20,
  },
});
