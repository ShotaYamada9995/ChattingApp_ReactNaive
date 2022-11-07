import React, {useState, useCallback, useEffect, useRef} from 'react';
import {View, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import VideoPost from '../../components/VideoPost';
import videosData from '../../videosData';
import {WINDOW_HEIGHT} from '../../utils';
import FeedsRepository from '../../repositories/FeedsRepository';
import VideoLoadingIndicator from '../../components/shared/VideoLoadingIndicator';
import {useNavigation} from '@react-navigation/native';
import {current} from '@reduxjs/toolkit';
import Video from 'react-native-video';
// import MediaRepository from '../../repositories/MediaRepository';

const Home = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [videos, setVideos] = useState([]);
  const currentPage = useRef(0);

  const keyExtractor = useCallback((item: any) => item._id, [videos]);

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

    try {
      const videos = await FeedsRepository.getInspiringVideos(
        currentPage.current,
      );

      setVideos(current => {
        return [...current, ...videos.data.slice(0, 4)];
      });

      currentPage.current++;
    } catch (error) {
      console.log('Error loading more videos: ');
      console.error(error);
    }
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
        setVideos(videos.data.slice(0, 1));
      } catch (error) {
        console.log('Error: ', error);
      }
    })();
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
          ListFooterComponent={renderScrollLoader}
          onEndReached={loadMoreVideos}
          onEndReachedThreshold={0}
        />
      ) : (
        <VideoLoadingIndicator />
      )}
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
