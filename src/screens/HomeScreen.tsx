import React, {useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

import Post from '../components/Post';
import videosData from '../videosData';
import {WINDOW_HEIGHT} from '../utils';

const HomeScreen = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const bottomTabHeight = useBottomTabBarHeight();

  return (
    <View style={styles.container}>
      <FlatList
        data={videosData}
        pagingEnabled
        renderItem={({item, index}) => (
          <Post data={item} isActive={activeVideoIndex === index} />
        )}
        onScroll={e => {
          const index = Math.round(
            e.nativeEvent.contentOffset.y / (WINDOW_HEIGHT - bottomTabHeight),
          );
          setActiveVideoIndex(index);
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
