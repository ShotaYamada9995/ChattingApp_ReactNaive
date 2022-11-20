import React from 'react';
import {View, StyleSheet, ScrollView, Platform} from 'react-native';
import {Icon} from '@rneui/themed';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils';
import {VIDEO_POST_HEIGHT} from '../../screens/Home/modules/InspiringVideoPost';

const SKELETON_COLOR_PRIMARY = 'rgba(60,60,60,0.5)';
const SKELETON_COLOR_SECONDARY = '#888';

interface Props {
  size: number;
}

export default ({size}: Props) => (
  <ScrollView pagingEnabled showsVerticalScrollIndicator={false}>
    {Array(size)
      .fill(null)
      .map((_, index) => (
        <View
          key={index}
          style={[styles.container, {height: VIDEO_POST_HEIGHT}]}>
          <View style={styles.bottomSection}>
            <View style={styles.bottomLeftSection}>
              <View style={styles.videoInfoContainer}>
                <View style={styles.userPic} />
                <View style={styles.username} />
                <View style={styles.username} />
                <View style={styles.followStatus} />
              </View>

              <View style={styles.caption} />
              <View style={styles.videoInfoContainer}>
                <Icon
                  name="play"
                  type="ionicon"
                  color={SKELETON_COLOR_SECONDARY}
                  size={20}
                />
                <View style={styles.inspiredCount} />
              </View>
            </View>

            <View style={styles.bottomRightSection}>
              <Icon
                name="bookmark"
                type="ionicon"
                color={SKELETON_COLOR_SECONDARY}
                style={styles.bottomRightIcon}
              />

              <Icon
                name="heart"
                type="ionicon"
                color={SKELETON_COLOR_SECONDARY}
                style={styles.bottomRightIcon}
              />

              <Icon
                name="chatbubbles"
                type="ionicon"
                color={SKELETON_COLOR_SECONDARY}
                style={styles.bottomRightIcon}
              />

              <Icon
                name="arrow-redo"
                type="ionicon"
                color={SKELETON_COLOR_SECONDARY}
                style={styles.bottomRightIcon}
              />

              <Icon
                name="ellipsis-horizontal"
                type="ionicon"
                color={SKELETON_COLOR_SECONDARY}
                style={styles.bottomRightIcon}
              />
            </View>
          </View>
        </View>
      ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: SKELETON_COLOR_PRIMARY,
    width: '100%',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 8,
    paddingBottom: 16,
    alignItems: 'flex-end',
  },
  bottomLeftSection: {
    flex: 4,
    paddingBottom: 15,
  },
  bottomRightSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 5,
  },
  bottomRightIcon: {
    marginBottom: 20,
  },
  videoInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPic: {
    width: 30,
    height: 30,
    borderRadius: 100,
    marginRight: 5,
    backgroundColor: SKELETON_COLOR_SECONDARY,
  },
  username: {
    marginRight: 5,
    width: 50,
    height: 15,
    backgroundColor: SKELETON_COLOR_SECONDARY,
  },
  followStatus: {
    marginRight: 5,
    width: 50,
    height: 22,
    backgroundColor: SKELETON_COLOR_SECONDARY,
  },
  caption: {
    width: 100,
    height: 20,
    backgroundColor: SKELETON_COLOR_SECONDARY,
    marginVertical: 15,
  },
  inspiredCount: {
    backgroundColor: SKELETON_COLOR_SECONDARY,
    width: 15,
    aspectRatio: 1,
  },
});
