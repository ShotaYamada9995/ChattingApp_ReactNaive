import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text, Input, Button, Icon} from '@rneui/themed';
import {Formik} from 'formik';
import * as yup from 'yup';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';

import AuthHeader from '../../components/headers/AuthHeader';
import {WINDOW_WIDTH} from '../../utils';
import AuthHeader1 from '../../components/headers/AuthHeader1';

const schema = yup.object().shape({
  firstname: yup.string().required('Please enter your email'),
  lastname: yup.string().required(),
  email: yup
    .string()
    .email('Invalid email')
    .required('Please enter your email'),
});

type Values = {
  firstname: string;
  lastname: string;
  expertise: string;
  category: string;
  subCategory: string;
};

export default () => {
  const auth = useSelector((state: any) => state.auth);

  const handleSubmit = (values: Values) => {
    console.log(values);
  };

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
            expertise: auth.expertise,
            category: auth.category,
            subCategory: auth.subCategory,
          }}
          onSubmit={handleSubmit}>
          {({handleChange, handleSubmit, values, errors, isSubmitting}) => (
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
                rightIcon={
                  values.email && !errors.email ? (
                    <Icon name="checkmark-circle" type="ionicon" />
                  ) : undefined
                }
                rightIconContainerStyle={{
                  backgroundColor: '#F1F1F1',
                }}
                value={values.email}
                onChangeText={handleChange('email')}
                errorMessage={errors.email}
              />

              <Text style={styles.dropdownLabel}>Area of Expertise</Text>
              <SelectDropdown
                data={['Data 1', 'Data 2']}
                defaultValue={values.expertise}
                buttonStyle={styles.dropdownContainer}
                buttonTextStyle={styles.dropdown}
                dropdownStyle={styles.dropdownStyle}
                rowTextStyle={styles.dropdownRowTextStyle}
                rowStyle={styles.dropdownRowStyle}
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
                onSelect={(selectedItem, index) => console.log(selectedItem)}
              />

              <Text style={styles.dropdownLabel}>Category</Text>
              <SelectDropdown
                data={['Data 1', 'Data 2']}
                defaultValue={values.category}
                buttonStyle={styles.dropdownContainer}
                buttonTextStyle={styles.dropdown}
                dropdownStyle={styles.dropdownStyle}
                rowTextStyle={styles.dropdownRowTextStyle}
                rowStyle={styles.dropdownRowStyle}
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
                onSelect={(selectedItem, index) => console.log(selectedItem)}
              />

              <Text style={styles.dropdownLabel}>Sub-category</Text>
              <SelectDropdown
                data={['Data 1', 'Data 2']}
                defaultValue={values.subCategory}
                buttonStyle={styles.dropdownContainer}
                buttonTextStyle={styles.dropdown}
                dropdownStyle={styles.dropdownStyle}
                rowTextStyle={styles.dropdownRowTextStyle}
                rowStyle={styles.dropdownRowStyle}
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
                onSelect={(selectedItem, index) => console.log(selectedItem)}
              />

              <Button
                title="Confirm Info"
                containerStyle={styles.btn}
                buttonStyle={{paddingVertical: 10}}
                color="#001433"
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
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
    // backgroundColor: COLORS.primary,
    alignSelf: 'center',
  },
  dropdown: {
    fontSize: 15,
    // color: COLORS.secondary,
  },
  dropdownStyle: {/* backgroundColor: COLORS.primary, */ borderRadius: 10},
  dropdownRowTextStyle: {color: 'black', fontSize: 15},
  dropdownRowStyle: {
    /* borderBottomColor: COLORS.faintWhite */
  },
});