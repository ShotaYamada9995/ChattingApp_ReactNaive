import React, {useState, useCallback, useEffect, useRef, useMemo} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Platform,
} from 'react-native';
import {RecyclerListView} from 'recyclerlistview';
import {useDispatch, useSelector} from 'react-redux';
import {BottomSheet, Button} from '@rneui/themed';
import {FlashList} from '@shopify/flash-list';

import VideoPost, {VIDEO_POST_HEIGHT} from './modules/VideoPost';
import AuthModal from './modules/AuthModal';

import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils';

import FeedsRepository from '../../repositories/FeedsRepository';
import UsersRepository from '../../repositories/UsersRepository';

import VideoPostSkeleton from '../../components/skeleton/VideoPostSkeleton';

import {addVideos} from '../../store/reducers/InspiringVideos';
import {addFollowers} from '../../store/reducers/User';

import globalStyles from '../../styles/globalStyles';

type LoadingStatusProps = 'loading' | 'success' | 'error';

const Home = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.user);
  const inspiringVideos = useSelector((state: any) => state.inspiringVideos);

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isLoadingMoreVideos, setisLoadingMoreVideos] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingStatus, setLoadingStatus] =
    useState<LoadingStatusProps>('loading');

  const currentPage = useRef(0);

  const LoadMoreVideosIndicator = useMemo(
    () =>
      isLoadingMoreVideos && (
        <ActivityIndicator
          size="large"
          style={styles.loadMoreVideosIndicator}
        />
      ),
    [isLoadingMoreVideos],
  );

  const VideoPostComp = ({item, index}: any) => (
    <VideoPost
      id={item._id}
      videoSource={item.file[0].cdnUrl}
      thumbnailSource={item.thumbnail[0].cdnUrl}
      caption={item.text}
      inspiredCount={item.inspired_count}
      userSlug={item.userSlug}
      userImage={item.user[0]?.imageUrl?.cdnUrl}
      userFirstname={item.user[0].profile.firstName}
      userLastname={item.user[0].profile.lastName}
      isLiked={
        user.isLoggedIn && item.inspired && item.inspired.includes(user?.slug)
      }
      isPlaying={activeVideoIndex === index}
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
        const response = await FeedsRepository.getInspiringVideos(
          currentPage.current,
        );

        const newVideos = response.filter(
          (newVideo: any) =>
            !inspiringVideos.some(
              (inspiringVideo: any) => inspiringVideo._id === newVideo._id,
            ),
        );

        dispatch(addVideos(newVideos));

        currentPage.current++;
      } catch (error) {
        console.log('Error loading more videos: ');
        console.error(error);
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
          extraData={activeVideoIndex}
          estimatedItemSize={VIDEO_POST_HEIGHT}
          pagingEnabled
          renderItem={VideoPostComp}
          onScroll={handleOnVideoListScroll}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreVideos}
          onEndReachedThreshold={0}
        />
      ) : loadingStatus === 'loading' ? (
        <VideoPostSkeleton />
      ) : (
        <View style={styles.failedLoadingContainer}>
          <Text style={styles.failedLoadingMessage}>
            Failed to load videos. Check your network connection and{' '}
            <Text style={globalStyles.link} onPress={getVideos}>
              try again
            </Text>
          </Text>
        </View>
      )}

      {/* {LoadMoreVideosIndicator} */}

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
  loadMoreVideosIndicator: {position: 'absolute', bottom: 30, left: '45%'},
  videoContainer: {flexGrow: 0},
  failedLoadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  failedLoadingMessage: {
    color: 'white',
    fontSize: WINDOW_WIDTH * 0.05,
    textAlign: 'center',
    maxWidth: '90%',
  },
});

export default Home;
