import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Avatar, CheckBox} from '@rneui/themed';

import globalStyles from '../../styles/globalStyles';
import {WINDOW_WIDTH} from '../../utils';

type User = {
  image?: string;
  name: string;
  slug: string;
  expertise: string;
  onSelect: (slug: string) => void;
};

const User = ({image, name, slug, expertise, onSelect}: User) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleOnSelect = () => {
    setIsSelected(current => !current);
    onSelect(slug);
  };

  return (
    <View style={styles.container}>
      <View style={globalStyles.rowLayout}>
        <Avatar
          source={require('../../assets/images/default_profile_image.jpeg')}
          rounded
          size="medium"
        />

        <View style={{marginLeft: 10}}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.expertise}>expert in {expertise}</Text>
        </View>
      </View>

      <CheckBox checked={isSelected} onPress={handleOnSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.rowLayout,
    width: '100%',
  },
  title: {
    color: 'grey',
    fontSize: 15,
    fontWeight: 'bold',
    maxWidth: WINDOW_WIDTH * 0.5,
  },
  expertise: {
    color: 'grey',
    fontSize: 12,
    maxWidth: WINDOW_WIDTH * 0.5,
  },
});

export default User;
