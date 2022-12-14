import React, {useState, useEffect, useRef, useMemo} from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {Button} from '@rneui/themed';
import {useToast} from 'react-native-toast-notifications';

import VideoPost, {VIDEO_POST_HEIGHT} from './modules/InspiringVideoPost';
import AuthModal from './modules/AuthModal';

import {WINDOW_WIDTH} from '../../utils';

import FeedsRepository from '../../repositories/FeedsRepository';
import UsersRepository from '../../repositories/UsersRepository';

import VideoPostSkeleton from '../../components/skeleton/VideoPostSkeleton';

import {addVideos} from '../../store/reducers/InspiringVideos';
import {addFollowers} from '../../store/reducers/User';

type LoadingStatusProps = 'loading' | 'success' | 'error';

const Home = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const {user, inspiringVideos} = useSelector((state: any) => ({
    user: state.user,
    inspiringVideos: state.inspiringVideos,
  }));

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isLoadingMoreVideos, setisLoadingMoreVideos] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingStatus, setLoadingStatus] =
    useState<LoadingStatusProps>('loading');

  const currentPage = useRef(0);

  const LoadMoreVideosIndicator = useMemo(
    () => (isLoadingMoreVideos ? <VideoPostSkeleton size={1} /> : null),
    [isLoadingMoreVideos],
  );

  const VideoPostComp = ({item, index}: any) => (
    <VideoPost
      id={item?._id}
      videoSource={item?.file[0]?.cdnUrl}
      thumbnailSource={item?.thumbnail[0]?.cdnUrl}
      caption={item?.text}
      inspiredCount={item?.inspired_count}
      userSlug={item?.userSlug}
      userImage={item?.user[0]?.imageUrl?.cdnUrl}
      userFirstname={item.user[0]?.profile?.firstName}
      userLastname={item.user[0]?.profile?.lastName}
      isLiked={
        user.isLoggedIn && item.inspired && item.inspired.includes(user?.slug)
      }
      isActive={activeVideoIndex === index}
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
        const videos = await FeedsRepository.getInspiringVideos(
          currentPage.current,
        );

        const newVideos = videos.filter(
          (video: any) =>
            !inspiringVideos.some(
              (inspiringVideo: any) => inspiringVideo._id === video._id,
            ),
        );

        if (newVideos.length > 0) {
          dispatch(addVideos(newVideos));

          currentPage.current++;
        } else {
          toast.show('No more videos', {
            type: 'normal',
            duration: 3000,
          });
        }
      } catch (error) {
        return;
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

      currentPage.current++;

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
          snapToOffsets={[...Array(inspiringVideos.length)].map(
            (x, i) => i * VIDEO_POST_HEIGHT,
          )}
          snapToAlignment="start"
          decelerationRate="fast"
          renderItem={VideoPostComp}
          onScroll={handleOnVideoListScroll}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreVideos}
          onEndReachedThreshold={0.2}
          ListFooterComponent={LoadMoreVideosIndicator}
        />
      ) : loadingStatus === 'loading' ? (
        <VideoPostSkeleton size={6} />
      ) : (
        <View style={styles.failedLoadingContainer}>
          <Text style={styles.failedLoadingMessage}>
            Failed to load videos. Must be your network connection
          </Text>

          <Button
            title="Retry"
            containerStyle={styles.retryBtn}
            buttonStyle={{paddingVertical: 10}}
            color="#001433"
            onPress={getVideos}
          />
        </View>
      )}

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
  videoContainer: {flexGrow: 0},
  failedLoadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(60,60,60,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  failedLoadingMessage: {
    color: 'white',
    fontSize: WINDOW_WIDTH * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: '90%',
  },
  retryBtn: {
    width: '48%',
    marginTop: 30,
    alignSelf: 'center',
  },
});

export default Home;
