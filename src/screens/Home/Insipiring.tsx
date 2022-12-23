import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {Button} from '@rneui/themed';
import {useToast} from 'react-native-toast-notifications';

import VideoPost, {VIDEO_POST_HEIGHT} from './modules/VideoPost';
import AuthModal from './modules/AuthModal';

import {WINDOW_WIDTH} from '../../utils';

import FeedsRepository from '../../repositories/FeedsRepository';
import UsersRepository from '../../repositories/UsersRepository';
import MediaRepository from '../../repositories/MediaRepository';

import VideoPostSkeleton from '../../components/skeleton/VideoPostSkeleton';

import {
  addVideos,
  likeVideo,
  unlikeVideo,
} from '../../store/reducers/InspiringVideos';
import {addFollowers} from '../../store/reducers/User';
import {useNavigation} from '@react-navigation/native';
import {update} from '../../store/reducers/Login';

type LoadingStatusProps = 'loading' | 'success' | 'error';

const Home = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigation = useNavigation();

  const {user, inspiringVideos} = useSelector((state: any) => ({
    user: state.user,
    inspiringVideos: state.inspiringVideos,
  }));

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isLoadingMoreVideos, setisLoadingMoreVideos] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingStatus, setLoadingStatus] =
    useState<LoadingStatusProps>('loading');

  const currentPage = useRef(0);

  const like = async (id: string) => {
    if (user.isLoggedIn) {
      dispatch(likeVideo({id, username: user.slug}));

      try {
        await MediaRepository.likeVideo({
          id,
          userSlug: user.slug,
        });
      } catch (error) {
        return;
      }
    } else {
      dispatch(update('Main'));
      navigation.navigate('LoginOptions');
    }
  };

  const unlike = async (id: string) => {
    if (user.isLoggedIn) {
      dispatch(unlikeVideo({id, username: user.slug}));

      try {
        await MediaRepository.unlikeVideo({
          id,
          userSlug: user.slug,
        });
      } catch (error) {
        return;
      }
    } else {
      dispatch(update('Main'));
      navigation.navigate('LoginOptions');
    }
  };

  const VideoPostComp = ({item, index}: any) => (
    <VideoPost
      id={item?._id}
      videoSource={item?.file[0]?.cdnUrl.replace(/\s/g, '%20')}
      thumbnailSource={item?.thumbnail[0]?.cdnUrl}
      caption={item?.text}
      inspiredCount={item?.inspired_count}
      userSlug={item?.userSlug}
      userImage={item?.user[0]?.imageUrl?.cdnUrl}
      userFirstname={item.user[0]?.profile?.firstName}
      userLastname={item.user[0]?.profile?.lastName}
      isLiked={
        user.isLoggedIn && item.inspired && item.inspired.includes(user?.slug)
      }
      isActive={activeVideoIndex === index}
      isPrevActive={activeVideoIndex === index - 1}
      isNextActive={activeVideoIndex === index + 1}
      onLike={like}
      onUnlike={unlike}
    />
  );

  const AuthModalComp = useMemo(
    () => (
      <AuthModal
        isVisible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    ),
    [showAuthModal],
  );

  const loadMoreVideos = async () => {
    // Multicall fix
    if (!isLoadingMoreVideos) {
      setisLoadingMoreVideos(true);
      try {
        const videos = await FeedsRepository.getInspiringVideos(
          currentPage.current,
        );

        const newVideos = videos.filter(
          (video: any) =>
            !inspiringVideos.some(
              (inspiringVideo: any) => inspiringVideo._id === video._id,
            ),
        );

        if (newVideos.length > 0) {
          dispatch(addVideos(newVideos));

          currentPage.current++;
        } else {
          toast.show('No more videos', {
            type: 'normal',
            duration: 3000,
          });
        }
      } catch (error) {
        return;
      } finally {
        setisLoadingMoreVideos(false);
      }
    }
  };

  const getVideos = async () => {
    if (loadingStatus !== 'loading') {
      setLoadingStatus('loading');
    }

    try {
      const videos = await FeedsRepository.getInspiringVideos(
        currentPage.current,
      );

      if (user.isLoggedIn) {
        const {data: following} = await UsersRepository.getFollowing(user.slug);
        const followedUsers = following.map(user => user.following);
        dispatch(addFollowers(followedUsers));
      }
      dispatch(addVideos(videos));

      setLoadingStatus('success');

      currentPage.current++;

      if (!user.isLoggedIn) {
        setShowAuthModal(true);
      }
    } catch (error) {
      setLoadingStatus('error');
    }
  };

  useEffect(() => {
    if (inspiringVideos.length === 0) {
      getVideos();
    }
  }, []);

  const keyExtractor = (item: any, index: number) => item._id;

  const handleOnVideoListScroll = e => {
    const index = Math.round(
      e.nativeEvent.contentOffset.y / e.nativeEvent.layoutMeasurement.height,
    );
    setActiveVideoIndex(index);
  };

  return (
    <View style={styles.container}>
      {loadingStatus === 'success' || inspiringVideos.length > 0 ? (
        <FlashList
          keyExtractor={keyExtractor}
          data={inspiringVideos}
          renderItem={VideoPostComp}
          extraData={{activeVideoIndex, userIsLoggedIn: user.isLoggedIn}}
          estimatedItemSize={VIDEO_POST_HEIGHT}
          pagingEnabled
          snapToOffsets={[...Array(inspiringVideos.length)].map(
            (x, i) => i * VIDEO_POST_HEIGHT,
          )}
          snapToAlignment="start"
          decelerationRate="fast"
          drawDistance={VIDEO_POST_HEIGHT * 6}
          onScroll={handleOnVideoListScroll}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreVideos}
          onEndReachedThreshold={0.2}
        />
      ) : loadingStatus === 'loading' ? (
        <VideoPostSkeleton size={6} />
      ) : (
        <View style={styles.failedLoadingContainer}>
          <Text style={styles.failedLoadingMessage}>
            Failed to load videos. Must be your network connection
          </Text>

          <Button
            title="Retry"
            containerStyle={styles.retryBtn}
            buttonStyle={{paddingVertical: 10}}
            color="#001433"
            onPress={getVideos}
          />
        </View>
      )}

      {isLoadingMoreVideos && (
        <ActivityIndicator size="small" style={styles.loadingIndicator} />
      )}

      {AuthModalComp}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollLoader: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  videoContainer: {flexGrow: 0},
  failedLoadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(60,60,60,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  failedLoadingMessage: {
    color: 'white',
    fontSize: WINDOW_WIDTH * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: '90%',
  },
  retryBtn: {
    width: '48%',
    marginTop: 30,
    alignSelf: 'center',
  },
  loadingIndicator: {position: 'absolute', bottom: 10, right: 10},
});

export default Home;

// <FlatList
//   data={inspiringVideos}
//   keyExtractor={keyExtractor}
//   renderItem={VideoPostComp}
//   pagingEnabled
//   snapToOffsets={[...Array(inspiringVideos.length)].map(
//     (x, i) => i * VIDEO_POST_HEIGHT,
//   )}
//   snapToAlignment="start"
//   decelerationRate="fast"
//   onScroll={handleOnVideoListScroll}
//   showsVerticalScrollIndicator={false}
//   windowSize={5}
//   maxToRenderPerBatch={5}
//   // getItemLayout={getItemLayout}
//   style={styles.videoContainer}
//   onEndReached={loadMoreVideos}
//   onEndReachedThreshold={0.2}
//   ListFooterComponent={LoadMoreVideosIndicator}
// />
