import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import {Button, Icon, SearchBar, Avatar} from '@rneui/themed';

import globalStyles from '../../../styles/globalStyles';

import Users from './modules/Users';

interface TagPeopleProps {
  tags: any[];
  setTags: () => void;
  onCancel: () => void;
}

const TagPeople = ({tags, setTags, onCancel}: TagPeopleProps) => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');

  const handleSearchText = (value: string) => {
    setSearchText(value);
  };

  return (
    <View style={[styles.container]}>
      <View style={globalStyles.rowLayout}>
        <TouchableOpacity onPress={onCancel}>
          <Icon name="close-outline" type="ionicon" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Tag People</Text>
        <View />
      </View>

      <SearchBar
        placeholder="Who's in this video?"
        value={searchText}
        onChangeText={handleSearchText}
        platform={Platform.OS === 'ios' ? 'ios' : 'android'}
      />

      <Users title="All Users" />

      <View style={styles.tagsContainer}>
        <ScrollView
          contentContainerStyle={styles.selectedUsersContainer}
          horizontal>
          <TouchableOpacity style={{alignSelf: 'flex-start'}}>
            <Avatar
              source={require('../../../assets/images/profile_picture.webp')}
              rounded
              size="medium"
            />

            <View style={styles.avatarCancelIcon}>
              <Icon name="close-circle" type="ionicon" size={20} />
            </View>
          </TouchableOpacity>
        </ScrollView>

        <Button
          title={tags.length ? `Done${tags.length}` : 'Done'}
          containerStyle={styles.btn}
          buttonStyle={{paddingVertical: 15, borderColor: '#001433'}}
          color="#001433"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
    backgroundColor: 'white',
    padding: 10,
  },
  headerText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  btn: {
    width: '100%',
  },
  tagsContainer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 10,
  },
  selectedUsersContainer: {
    marginBottom: 5,
  },
  avatarCancelIcon: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: 'white',
    borderRadius: 100,
  },
});

export default TagPeople;
