import React, {useState, useCallback, useEffect} from 'react';
import {View, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import VideoPost from '../../components/VideoPost';
import videosData from '../../videosData';
import {WINDOW_HEIGHT} from '../../utils';
import MediaRepository from '../../repositories/MediaRepository';
import VideoLoadingIndicator from '../../components/shared/VideoLoadingIndicator';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const navigation = useNavigation();

  const bottomTabHeight = useBottomTabBarHeight();

  const keyExtractor = useCallback((item: any) => item._id, [videos]);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: WINDOW_HEIGHT - bottomTabHeight,
      offset: (WINDOW_HEIGHT - bottomTabHeight) * index,
      index,
    }),
    [],
  );

  const renderVideoPost = ({item, index}) => (
    <VideoPost videoItem={item} isActive={activeVideoIndex === index} />
  );

  const loadMore = () => {
    setIsLoadingMore(true);
    // load more videos
  };

  const handleOnScroll = e => {
    const index = Math.round(
      e.nativeEvent.contentOffset.y / (WINDOW_HEIGHT - WINDOW_HEIGHT * 0.104),
    );
    setActiveVideoIndex(index);
  };

  useEffect(() => {
    navigation.navigate('MiniProfile');
    // (async () => {
    //   try {
    //     const videos = await MediaRepository.getVideos(0);
    //     // setVideos(videos.data);
    //   } catch (error) {
    //     console.log('Error: ', error);
    //   }
    // })();
  }, []);

  return (
    <View style={styles.container}>
      {videos.length > 0 ? (
        <FlatList
          data={videos}
          keyExtractor={keyExtractor}
          pagingEnabled
          renderItem={renderVideoPost}
          onScroll={handleOnScroll}
          showsVerticalScrollIndicator={false}
          windowSize={3}
          maxToRenderPerBatch={3}
          getItemLayout={getItemLayout}
          onEndReached={loadMore}
          onEndReachedThreshold={0}
        />
      ) : (
        <VideoLoadingIndicator />
      )}

      {/* {isLoadingMore && (
        <ActivityIndicator size="large" style={styles.scrollLoader} />
      )} */}
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
});

export default Home;
