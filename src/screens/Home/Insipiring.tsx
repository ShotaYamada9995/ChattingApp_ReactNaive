import React, {useState, useCallback, useEffect, useRef, useMemo} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Platform,
} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {useDispatch, useSelector} from 'react-redux';

import VideoPost from './modules/VideoPost';
import AuthModal from './modules/AuthModal';

import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils';

import FeedsRepository from '../../repositories/FeedsRepository';
import UsersRepository from '../../repositories/UsersRepository';

import VideoPostSkeleton from '../../components/skeleton/VideoPostSkeleton';

import {addVideos} from '../../store/reducers/InspiringVideos';
import {addFollowers} from '../../store/reducers/User';

import globalStyles from '../../styles/globalStyles';

type LoadingStatusProps = 'loading' | 'success' | 'error';

const createDataProvider = () => {
  return new DataProvider((r1, r2) => r1 !== r2);
};

const Home = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.user);
  const inspiringVideos = useSelector((state: any) => state.inspiringVideos);

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isLoadingMoreVideos, setisLoadingMoreVideos] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingStatus, setLoadingStatus] =
    useState<LoadingStatusProps>('loading');
  const [dataProvider, setdataProvider] = useState(null);

  const currentPage = useRef(0);

  const VIDEO_POST_HEIGHT =
    Platform.OS === 'ios'
      ? WINDOW_HEIGHT - WINDOW_HEIGHT * 0.1
      : WINDOW_HEIGHT - WINDOW_HEIGHT * 0.104;

  const layoutProvider = new LayoutProvider(
    index => 0,
    (type, dim) => {
      dim.width = WINDOW_WIDTH;
      dim.height = VIDEO_POST_HEIGHT + (WINDOW_WIDTH * 0.15) / 2;
    },
  );

  const handleOnVideoListScroll = e => {
    const index = Math.round(
      e.nativeEvent.contentOffset.y / (WINDOW_HEIGHT - WINDOW_HEIGHT * 0.104),
    );
    setActiveVideoIndex(index);
  };

  const handleRecylerListScroll = (_, offsetX: number, offsetY: number) => {
    const index = Math.round(offsetY / (WINDOW_HEIGHT - WINDOW_HEIGHT * 0.104));
    setActiveVideoIndex(index);
  };

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

  const VideoPostComp = (type, videoPost, index: number) => {
    return (
      <VideoPost
        id={videoPost._id}
        videoSource={videoPost.file[0].cdnUrl}
        thumbnailSource={videoPost.thumbnail[0].cdnUrl}
        caption={videoPost.text}
        inspiredCount={videoPost.inspired_count}
        userSlug={videoPost.userSlug}
        userImage={videoPost.user[0].imageUrl.cdnUrl}
        userFirstname={videoPost.user[0].profile.firstName}
        userLastname={videoPost.user[0].profile.lastName}
        isLiked={
          user.isLoggedIn && Array.from(videoPost.inspired).includes(user?.slug)
        }
        isPlaying={activeVideoIndex === index}
      />
    );
  };

  const AuthModalComp = useMemo(
    () => (
      <AuthModal
        isVisible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    ),
    [showAuthModal],
  );

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
      setdataProvider(createDataProvider().cloneWithRows(videos));

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

  return (
    <View style={styles.container}>
      {loadingStatus === 'success' && dataProvider ? (
        <RecyclerListView
          dataProvider={dataProvider}
          layoutProvider={layoutProvider}
          rowRenderer={VideoPostComp}
          initialRenderIndex={0}
          renderAheadOffset={VIDEO_POST_HEIGHT}
          // onVisibleIndicesChanged={(all: number[], now: number[]) => {
          //   setActiveVideoIndex(all.pop() || 0);
          // }}
          // onEndReached={loadMoreVideos}
          // onEndReachedThreshold={0}
          showsVerticalScrollIndicator={false}
          pagingEnabled
          style={styles.videoContainer}
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

      {LoadMoreVideosIndicator}

      {AuthModalComp}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadMoreVideosIndicator: {position: 'absolute', bottom: 30, left: '45%'},
  videoContainer: {flex: 1},
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
