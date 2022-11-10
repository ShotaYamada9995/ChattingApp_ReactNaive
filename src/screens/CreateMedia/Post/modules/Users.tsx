import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Avatar, CheckBox} from '@rneui/themed';

import globalStyle from '../../../../styles/globalStyles';

type User = {
  image: string;
  name: string;
  description: string;
};

interface Users {
  title: string;
  tags?: User[];
  onSelect?: () => void;
}

const Users = ({title, tags, onSelect}: Users) => {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>

      <View style={globalStyle.rowLayout}>
        <View style={globalStyle.rowLayout}>
          <Avatar
            source={require('../assets/images/profile_picture.webp')}
            rounded
            size="medium"
          />

          <View style={{marginLeft: 10}}>
            <Text style={styles.title}>Valentine Orga</Text>
            <Text style={styles.description}>Software Developer</Text>
          </View>
        </View>

        <CheckBox checked={false} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'grey',
    fontSize: 15,
    fontWeight: 'bold',
  },
  description: {
    color: 'grey',
    fontSize: 12,
  },
});

export default Users;
