import React, {useState, useEffect, useRef, useMemo, memo} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
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
import RNFetchBlob from 'rn-fetch-blob';
import {useToast} from 'react-native-toast-notifications';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   cancelAnimation,
//   Easing,
// } from 'react-native-reanimated';

import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils';

import {useIsForeground} from '../../../hooks/useIsForeground';

import {followUser, unfollowUser} from '../../../store/reducers/User';
import {addBookmark, removeBookmark} from '../../../store/reducers/Bookmarks';

import UsersRepository from '../../../repositories/UsersRepository';

import PlaybackSpeedModal from './PlaybackSpeedModal';
import {formatNumber} from '../../../utils/helpers';

interface VideoPostProps {
  id: string;
  videoSource: string;
  thumbnailSource: string;
  caption: string;
  inspiredCount: number;
  playcounts: number;
  userSlug: string;
  userImage: string;
  userFirstname: string;
  userLastname: string;
  isLiked: boolean;
  isActive: boolean;
  isPrevActive: boolean;
  isNextActive: boolean;
  onLike: (id: string) => Promise<void>;
  onUnlike: (id: string) => Promise<void>;
  incrementViewsCount: (id: string) => void;
}

export const VIDEO_POST_HEIGHT =
  Platform.OS === 'ios'
    ? StaticSafeAreaInsets.safeAreaInsetsBottom !== 0
      ? WINDOW_HEIGHT - WINDOW_HEIGHT * 0.1
      : WINDOW_HEIGHT - WINDOW_HEIGHT * 0.07
    : WINDOW_HEIGHT - WINDOW_HEIGHT * 0.104;

const VideoPost = ({
  id,
  videoSource,
  thumbnailSource,
  caption,
  inspiredCount,
  playcounts,
  userSlug,
  userImage,
  userFirstname,
  userLastname,
  isLiked,
  isActive,
  isPrevActive,
  isNextActive,
  onLike,
  onUnlike,
  incrementViewsCount,
}: VideoPostProps) => {
  const {user, bookmarks} = useSelector((state: any) => ({
    user: state.user,
    bookmarks: state.bookmarks,
  }));
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();

  const videoRef = useRef(null);

  const [video, setVideo] = useState({
    isPaused: true,
    isLoaded: false,
    duration: 0,
    speed: 1,
  });
  const [showPlaybackSpeedModal, setShowPlaybackSpeedModal] = useState(false);
  // const [repeatCount, setRepeatCount] = useState(0);

  const isForeGround = useIsForeground();
  const isFocused = useIsFocused();
  const canPlayVideo = isForeGround && isFocused;
  const isVideoPaused = video.isPaused || !canPlayVideo;

  // const progressBarOffset = useSharedValue(-WINDOW_WIDTH);

  // const remainingDuration = useRef(0);

  // const animatedProgressBarStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{translateX: progressBarOffset.value}],
  //   };
  // });

  // const animateProgressBar = () => {
  //   progressBarOffset.value = withTiming(0, {
  //     duration:
  //       progressBarOffset.value === -WINDOW_WIDTH
  //         ? video.duration
  //         : remainingDuration.current,
  //     easing: Easing.linear,
  //   });
  // };

  // const repeatProgressBarAnimation = () => {
  //   cancelAnimation(progressBarOffset);
  //   progressBarOffset.value = -WINDOW_WIDTH;
  //   setRepeatCount(repeatCount => repeatCount + 1);
  // };

  const togglePause = () => {
    setVideo(video => ({...video, isPaused: !video.isPaused}));
  };

  const goToComments = () =>
    navigation.navigate('Comments', {
      videoId: id,
      user: {
        image: userImage,
        firstName: userFirstname,
        lastName: userLastname,
      },
    });

  const share = async () => {
    const options = {
      message: caption,
      url: videoSource,
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
        slug: userSlug,
        userSlug: user.slug,
        type: 'expert',
      });
    } catch (error) {
      return;
    }
  };

  const handleStoragePermission = async () => {
    if (Platform.OS === 'ios') {
      downloadVideo();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Whatido needs permission to access your storage to download videos',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadVideo();
        } else {
          Alert.alert('Storage permission not granted');
        }
      } catch (error) {
        console.log('Permission error');
        console.error(error);
      }
    }
  };

  const downloadVideo = () => {
    const ext = `.${videoSource.split('.').pop()}`;

    const {config, fs} = RNFetchBlob;
    const DownloadDir = fs.dirs.DownloadDir;
    const options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: DownloadDir + '/whatido_video_' + Date.now() + ext,
        description: 'video',
      },
    };

    toast.show('Downloading video...', {
      type: 'normal',
      duration: 3000,
    });

    config(options)
      .fetch('GET', videoSource)
      .then(res => {
        toast.show('Download complete', {
          type: 'success',
          duration: 3000,
        });
      })
      .catch(error => {
        toast.show('Failed to download video', {
          type: 'danger',
          duration: 3000,
        });
      });
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
      <Pressable onPress={() => onUnlike(id)}>
        <Icon
          name="heart"
          type="ionicon"
          color="red"
          style={styles.verticalBarIcon}
        />
      </Pressable>
    ) : (
      <Pressable onPress={() => onLike(id)}>
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

  const VideoThumbnail = useMemo(() => {
    return (
      !video.isLoaded && (
        <Image source={{uri: thumbnailSource}} style={styles.thumbnail} />
      )
    );
  }, [thumbnailSource, video.isLoaded]);

  const IOSVideoPlayer = useMemo(
    () =>
      isFocused && (
        <Pressable onPress={togglePause} style={styles.video}>
          <Video
            ref={videoRef}
            poster={thumbnailSource}
            posterResizeMode="cover"
            source={{
              uri: videoSource,
            }}
            automaticallyWaitsToMinimizeStalling={false}
            maxBitRate={700000}
            style={styles.video}
            resizeMode="cover"
            paused={isVideoPaused}
            playInBackground={false}
            rate={video.speed}
            repeat={true}
            hideShutterView={true}
            disableFocus={true}
            useTextureView={false}
            onLoad={data => {
              setVideo(video => ({
                ...video,
                isPaused: !isActive,
              }));
            }}
            // onProgress={data => {
            //   remainingDuration.current =
            //     (data.seekableDuration - data.currentTime) * 1000;
            // }}
            // onEnd={repeatProgressBarAnimation}
          />
        </Pressable>
      ),
    [
      video.speed,
      isVideoPaused,
      isFocused,
      videoSource,
      thumbnailSource,
      isActive,
      isPrevActive,
      isNextActive,
    ],
  );

  const AndroidVideoPlayer = useMemo(
    () =>
      isFocused &&
      isActive && (
        <Pressable onPress={togglePause} style={styles.video}>
          <Video
            ref={videoRef}
            source={{
              uri: videoSource,
            }}
            automaticallyWaitsToMinimizeStalling={false}
            bufferConfig={{
              minBufferMs: 100,
              maxBufferMs: 2000,
              bufferForPlaybackMs: 100,
              bufferForPlaybackAfterRebufferMs: 100,
            }}
            maxBitRate={700000}
            style={styles.video}
            resizeMode="cover"
            paused={isVideoPaused}
            playInBackground={false}
            rate={video.speed}
            repeat={true}
            hideShutterView={true}
            disableFocus={true}
            useTextureView={false}
            onLoad={data => {
              setVideo(video => ({
                ...video,
                isLoaded: true,
                isPaused: !isActive,
              }));
            }}
            // onProgress={data => {
            //   remainingDuration.current =
            //     (data.seekableDuration - data.currentTime) * 1000;
            // }}
            // onEnd={repeatProgressBarAnimation}
          />
        </Pressable>
      ),
    [
      video.speed,
      isVideoPaused,
      isFocused,
      videoSource,
      isActive,
      isPrevActive,
      isNextActive,
    ],
  );

  useEffect(() => {
    setVideo(video => ({...video, isPaused: !isActive}));

    if (isActive) {
      videoRef.current?.seek(0); // Restart video when focused

      incrementViewsCount(id); // Increment views count when focused
    }

    if (!isActive) {
      setVideo(video => ({
        ...video,
        isLoaded: false,
      }));
    }
  }, [isActive, isPrevActive, isNextActive]);

  // useEffect(() => {
  //   if (
  //     isActive &&
  //     video.duration > 0 &&
  //     !video.isPaused &&
  //     !video.isBuffering
  //   ) {
  //     animateProgressBar();
  //   }

  //   if (video.isBuffering || video.isPaused || !isActive) {
  //     cancelAnimation(progressBarOffset);
  //   }
  // }, [
  //   isActive,
  //   video.duration,
  //   video.isPaused,
  //   video.isBuffering,
  //   repeatCount,
  // ]);

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? IOSVideoPlayer : AndroidVideoPlayer}

      {Platform.OS === 'android' && VideoThumbnail}

      {/* <Animated.View style={[animatedProgressBarStyle, styles.progressBar]} /> */}

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
            <Text style={styles.playcounts}>{formatNumber(playcounts)}</Text>
          </View>
        </View>

        <View style={styles.bottomRightSection}>
          {BookmarkIcon}

          {LikeIcon()}

          <Pressable onPress={goToComments}>
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
              <MenuOption onSelect={handleStoragePermission}>
                <Text style={styles.menuOption}>Download</Text>
              </MenuOption>
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
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(60,60,60,0.5)',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    height: 10,
    width: '100%',
    backgroundColor: 'white',
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
  playcounts: {color: 'white'},
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
