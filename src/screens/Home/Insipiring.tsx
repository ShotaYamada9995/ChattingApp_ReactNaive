import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';

import VideoPost from './modules/VideoPost';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils';
import FeedsRepository from '../../repositories/FeedsRepository';
import VideoLoadingIndicator from '../../components/shared/VideoLoadingIndicator';
import {BottomSheet, Button} from '@rneui/themed';
import {useDispatch, useSelector} from 'react-redux';
import AuthModal from './modules/AuthModal';
import {addVideos} from '../../store/reducers/InspiringVideos';
import globalStyles from '../../styles/globalStyles';
import UsersRepository from '../../repositories/UsersRepository';
import {addFollowers} from '../../store/reducers/User';
import VideoPostSkeleton from '../../components/skeleton/VideoPostSkeleton';

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const inspiringVideos = useSelector((state: any) => state.inspiringVideos);

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [loadingStatus, setLoadingStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');

  const currentPage = useRef(0);

  const keyExtractor = (item: any, index: number) => item._id;

  const getItemLayout = useCallback(
    (data, index) => ({
      length: WINDOW_HEIGHT - WINDOW_HEIGHT * 0.104,
      offset: (WINDOW_HEIGHT - WINDOW_HEIGHT * 0.104) * index,
      index,
    }),
    [],
  );

  const loadMoreVideos = async () => {
    if (!isLoadingMore) {
      console.log('Loading more videos...');
      setIsLoadingMore(true);
      try {
        const videos = await FeedsRepository.getInspiringVideos(
          currentPage.current,
        );

        const newVideos = videos.filter(
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
        setIsLoadingMore(false);
      }
    }
  };

  const handleOnScroll = e => {
    const index = Math.round(
      e.nativeEvent.contentOffset.y / (WINDOW_HEIGHT - WINDOW_HEIGHT * 0.104),
    );
    setActiveVideoIndex(index);
  };

  const renderScrollLoader = useCallback(() => {
    return isLoadingMore ? (
      <ActivityIndicator
        size="large"
        style={{position: 'absolute', bottom: 30, left: '45%'}}
      />
    ) : null;
  }, [isLoadingMore]);

  const renderVideoPost = ({item, index}: any) => (
    <VideoPost
      isActive={activeVideoIndex === index}
      // videoItem={item}
      id={item._id}
      videoSource={item.file[0].cdnUrl}
      thumbnailSource={item.thumbnail[0].cdnUrl}
      caption={item.text}
      inspiredCount={item.inspired_count}
      isLiked={
        !user.isLoggedIn || !Array.from(item.inspired).includes(user?.slug)
      }
      userSlug={item.userSlug}
      userId={item?.user?.id}
      userImage={item?.user?.image}
      userFirstname={item?.user?.firstName}
      userLastname={item?.user?.lastName}
    />
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
        dispatch(addFollowers(following));
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

  return (
    <View style={styles.container}>
      {loadingStatus === 'success' || inspiringVideos.length > 0 ? (
        <FlatList
          data={inspiringVideos}
          keyExtractor={keyExtractor}
          pagingEnabled
          renderItem={renderVideoPost}
          onScroll={handleOnScroll}
          showsVerticalScrollIndicator={false}
          windowSize={3}
          maxToRenderPerBatch={3}
          getItemLayout={getItemLayout}
          style={styles.videoContainer}
          onEndReached={loadMoreVideos}
          onEndReachedThreshold={0}
        />
      ) : loadingStatus === 'loading' ? (
        <VideoPostSkeleton />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: WINDOW_WIDTH * 0.05,
              textAlign: 'center',
              maxWidth: '90%',
            }}>
            Failed to load videos. Check your network connection and{' '}
            <Text style={globalStyles.link} onPress={() => getVideos()}>
              try again
            </Text>
          </Text>
        </View>
      )}

      {renderScrollLoader()}

      <BottomSheet
        onBackdropPress={() => setShowAuthModal(false)}
        isVisible={showAuthModal}
        containerStyle={styles.authModalContainer}>
        <AuthModal onCancel={() => setShowAuthModal(false)} />
      </BottomSheet>
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
  authModalContainer: {
    justifyContent: 'center',
  },
});

export default Home;
