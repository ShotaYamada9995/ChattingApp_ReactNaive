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

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const inspiringVideos = useSelector((state: any) => state.inspiringVideos);

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [loadingStatus, setLoadingStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending');

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

  const renderVideoPost = ({item, index}) => (
    <VideoPost videoItem={item} isActive={activeVideoIndex === index} />
  );

  const loadMoreVideos = async () => {
    setIsLoadingMore(true);

    // try {
    console.log(currentPage.current);
    //   const videos = await FeedsRepository.getInspiringVideos(
    //     currentPage.current,
    //   );

    //  dispatch(addVideos(videos.data));

    currentPage.current++;
    // } catch (error) {
    //   console.log('Error loading more videos: ');
    //   console.error(error);
    // } finally {
    //   setIsLoadingMore(false);
    // }
  };

  const handleOnScroll = e => {
    const index = Math.round(
      e.nativeEvent.contentOffset.y / (WINDOW_HEIGHT - WINDOW_HEIGHT * 0.104),
    );
    setActiveVideoIndex(index);
  };

  const renderScrollLoader = () => {
    return isLoadingMore ? (
      <ActivityIndicator size="large" style={styles.scrollLoader} />
    ) : null;
  };

  const getVideos = async (page: number) => {
    if (loadingStatus !== 'pending') {
      setLoadingStatus('pending');
    }

    try {
      const videos = await FeedsRepository.getInspiringVideos(page);

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
      getVideos(currentPage.current);
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
          // ListFooterComponent={renderScrollLoader}
          // onEndReached={loadMoreVideos}
          // onEndReachedThreshold={0.001}
        />
      ) : loadingStatus === 'pending' ? (
        <VideoLoadingIndicator />
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
            <Text
              style={globalStyles.link}
              onPress={() => getVideos(currentPage.current)}>
              try again
            </Text>
          </Text>
        </View>
      )}

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
