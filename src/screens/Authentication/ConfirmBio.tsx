import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Input, Button, Icon} from '@rneui/themed';
import {Formik} from 'formik';
import * as yup from 'yup';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';

import AuthHeader from '../../components/headers/AuthHeader';
import {WINDOW_WIDTH} from '../../utils';
import AuthHeader1 from '../../components/headers/AuthHeader1';

import DataRepository from '../../repositories/DataRepository';
import {useRoute} from '@react-navigation/native';

const schema = yup.object().shape({
  firstname: yup.string().required('Please enter your email'),
  lastname: yup.string().required(),
  email: yup
    .string()
    .email('Invalid email')
    .required('Please enter your email'),
  community: yup.string().required(),
});

type Values = {
  firstname: string;
  lastname: string;
  email: string;
  community: string;
  expertise: never[];
};

export default () => {
  const auth = useSelector((state: any) => state.auth);

  const route = useRoute();

  const [communities, setCommunities] = useState([]);
  const [expertiseList, setExpertiseList] = useState([]);

  const handleSubmit = (values: Values) => {
    console.log(values);
  };

  const getExpertsCategoryList = async () => {
    const communities = await DataRepository.getExpertsCategoryList();

    setCommunities(communities);
  };

  useEffect(() => {
    getExpertsCategoryList();
  }, []);

  return (
    <View style={styles.container}>
      <AuthHeader1 />

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Formik
          validationSchema={schema}
          initialValues={{
            firstname: auth.firstname,
            lastname: auth.lastname,
            email: auth.email,
            community: auth.community,
            expertise: auth.expertise,
          }}
          onSubmit={handleSubmit}>
          {({handleChange, handleSubmit, setFieldValue, values, errors}) => (
            <>
              <Input
                label="First name"
                labelStyle={{
                  ...styles.dropdownLabel,
                  marginBottom: 5,
                  marginLeft: 0,
                }}
                placeholder="Ugochukwu"
                style={styles.inputField}
                value={values.firstname}
                onChangeText={handleChange('firstname')}
                errorMessage={errors.firstname}
              />

              <Input
                label="Last name"
                labelStyle={{
                  ...styles.dropdownLabel,
                  marginBottom: 5,
                  marginLeft: 0,
                }}
                placeholder="Orga"
                style={{...styles.inputField, marginBottom: -20}}
                value={values.lastname}
                onChangeText={handleChange('lastname')}
                errorMessage={errors.lastname}
                errorStyle={{marginTop: 20}}
              />

              <Input
                label="Email"
                labelStyle={{
                  ...styles.dropdownLabel,
                  marginBottom: 5,
                  marginLeft: 0,
                }}
                placeholder="WhatIDo@gmail.com"
                style={styles.inputField}
                rightIconContainerStyle={{
                  backgroundColor: '#F1F1F1',
                }}
                value={values.email}
                disabled
              />

              <Text style={styles.dropdownLabel}>Community</Text>
              <SelectDropdown
                data={route.params.communities.map(community => community.name)}
                defaultValue={values.community}
                buttonStyle={styles.dropdownContainer}
                buttonTextStyle={styles.dropdown}
                dropdownStyle={styles.dropdownStyle}
                rowTextStyle={styles.dropdownRowTextStyle}
                buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                rowTextForSelection={(item, index) => item}
                renderDropdownIcon={() => (
                  <Icon
                    name="chevron-down"
                    type="ionicon"
                    size={20}
                    color="grey"
                  />
                )}
                onSelect={(selectedItem, index) => {
                  if (values.community !== selectedItem) {
                    setFieldValue('community', selectedItem);
                    setFieldValue('expertise', []);
                    const community = communities.find(
                      community => community.name === selectedItem,
                    );

                    if (community) {
                      setExpertiseList(community.subcategories);
                    } else {
                      setExpertiseList([]);
                    }
                  }
                }}
              />

              <Text style={styles.dropdownLabel}>Expertise</Text>

              <View style={styles.expertiseContainer}>
                {values.expertise.map(item => (
                  <View key={item.name} style={styles.expertise}>
                    <Text>{item.name}</Text>

                    <TouchableOpacity
                      onPress={() =>
                        setFieldValue(
                          'expertise',
                          values.expertise.filter(
                            _item => _item.name !== item.name,
                          ),
                        )
                      }>
                      <Icon
                        name="close-outline"
                        type="ionicon"
                        size={WINDOW_WIDTH * 0.05}
                        iconStyle={{marginLeft: 5}}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <SelectDropdown
                data={expertiseList}
                buttonStyle={styles.dropdownContainer}
                buttonTextStyle={styles.dropdown}
                dropdownStyle={styles.dropdownStyle}
                rowTextStyle={styles.dropdownRowTextStyle}
                buttonTextAfterSelection={(selectedItem, index) =>
                  selectedItem.name
                }
                rowTextForSelection={(item, index) => item.name}
                renderDropdownIcon={() => (
                  <Icon
                    name="chevron-down"
                    type="ionicon"
                    size={20}
                    color="grey"
                  />
                )}
                onSelect={(selectedItem: string, index: number) => {
                  if (
                    !values.expertise.some(
                      item => item.name === selectedItem.name,
                    )
                  ) {
                    setFieldValue('expertise', [
                      ...values.expertise,
                      selectedItem,
                    ]);
                  }
                }}
              />

              <Button
                title="Confirm Info"
                containerStyle={styles.btn}
                buttonStyle={{paddingVertical: 10}}
                color="#001433"
                onPress={handleSubmit}
              />
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContainer: {
    padding: 10,
    marginTop: 30,
    paddingBottom: 100,
  },
  inputField: {
    padding: 10,
    backgroundColor: '#F1F1F1',
    borderWidth: 0,
    height: 40,
  },
  formBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn: {
    width: '50%',
    marginTop: 50,
    alignSelf: 'center',
  },
  dropdownLabel: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: -5,
    fontWeight: 'bold',
    fontSize: WINDOW_WIDTH * 0.04,
    color: 'grey',
  },
  dropdownContainer: {
    width: '95%',
    height: 40,
    marginVertical: 10,
    alignSelf: 'center',
  },
  dropdown: {
    fontSize: 15,
  },
  dropdownStyle: {borderRadius: 10},
  dropdownRowTextStyle: {color: 'black', fontSize: 15},
  expertiseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    marginLeft: 5,
  },
  expertise: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'grey',
    marginLeft: 5,
  },
});
