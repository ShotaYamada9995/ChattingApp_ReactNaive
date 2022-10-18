import React, {useState, useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

import Post from '../../components/Post';
import videosData from '../../videosData';
import {WINDOW_HEIGHT} from '../../utils';

const Home = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

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

  const renderPost = ({item, index}) => (
    <Post data={item} isActive={activeVideoIndex === index} />
  );

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
        renderItem={renderPost}
        onScroll={handleOnScroll}
        showsVerticalScrollIndicator={false}
        windowSize={3}
        maxToRenderPerBatch={3}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Home;
