import React, {useState, useCallback} from 'react';
import {View, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

import VideoPost from '../../components/VideoPost';
import videosData from '../../videosData';
import {WINDOW_HEIGHT} from '../../utils';
import {getVideos} from '../../repositories/MediaRepository';

const Home = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [videos, setVideo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const bottomTabHeight = useBottomTabBarHeight();

  const keyExtractor = useCallback(video => video.id, []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: WINDOW_HEIGHT - bottomTabHeight,
      offset: (WINDOW_HEIGHT - bottomTabHeight) * index,
      index,
    }),
    [],
  );

  const renderVideoPost = ({item, index}) => (
    <VideoPost data={item} isActive={activeVideoIndex === index} />
  );

  const loadMore = () => {
    setIsLoadingMore(true);
    // load more videos
  };

  const handleOnScroll = e => {
    const index = Math.round(
      e.nativeEvent.contentOffset.y / (WINDOW_HEIGHT - bottomTabHeight),
    );
    setActiveVideoIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={videosData}
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

      {isLoadingMore && (
        <ActivityIndicator size="large" style={styles.scrollLoader} />
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
