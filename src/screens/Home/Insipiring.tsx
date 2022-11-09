import React, {useState, useCallback, useEffect, useRef} from 'react';
import {View, FlatList, StyleSheet, ActivityIndicator} from 'react-native';

import VideoPost from '../../components/VideoPost';
import {WINDOW_HEIGHT} from '../../utils';
import FeedsRepository from '../../repositories/FeedsRepository';
import VideoLoadingIndicator from '../../components/shared/VideoLoadingIndicator';
import {BottomSheet} from '@rneui/themed';
import {useDispatch, useSelector} from 'react-redux';
import AuthModal from './modules/AuthModal';
import {addVideos} from '../../store/reducers/InspiringVideos';

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const inspiringVideos = useSelector((state: any) => state.inspiringVideos);

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [videos, setVideos] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const currentPage = useRef(1);

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

  useEffect(() => {
    (async () => {
      try {
        const videos = await FeedsRepository.getInspiringVideos(0);
        dispatch(addVideos(videos.data));

        if (!user.isLoggedIn) {
          setTimeout(() => setShowAuthModal(true), 2000);
        }
      } catch (error) {
        console.log('Error: ', error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {inspiringVideos.length > 0 ? (
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
          ListFooterComponent={renderScrollLoader}
          // onEndReached={loadMoreVideos}
          // onEndReachedThreshold={0.001}
        />
      ) : (
        <VideoLoadingIndicator />
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
  authModalContainer: {
    justifyContent: 'center',
  },
});

export default Home;
