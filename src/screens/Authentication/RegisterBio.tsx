import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text, Input, Button, Icon} from '@rneui/themed';
import {Formik} from 'formik';
import * as yup from 'yup';

import AuthHeader from '../../components/headers/AuthHeader';

const schema = yup.object().shape({
  firstname: yup.string().required('Please enter your email'),
  lastname: yup.string().required(),
});

type Values = {
  firstname: string;
  lastname: string;
};

export default () => {
  const handleSubmit = (values: Values) => {
    console.log(values);
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        title="Welcome back"
        caption="Please enter your details below"
      />

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Formik
          validationSchema={schema}
          initialValues={{firstname: '', lastname: ''}}
          onSubmit={handleSubmit}>
          {({handleChange, handleSubmit, values, errors, isSubmitting}) => (
            <>
              <Input
                label="First name"
                placeholder="Ugochukwu"
                style={styles.inputField}
                value={values.firstname}
                onChangeText={handleChange('firstname')}
                errorMessage={errors.firstname}
              />

              <Input
                label="Last name"
                placeholder="Orga"
                style={{...styles.inputField, marginBottom: -20}}
                value={values.lastname}
                onChangeText={handleChange('lastname')}
                errorMessage={errors.lastname}
                errorStyle={{marginTop: 20}}
              />

              <Button
                title="Next"
                containerStyle={styles.btn}
                buttonStyle={{paddingVertical: 10}}
                color="#001433"
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
    width: '80%',
    marginTop: 50,
    alignSelf: 'center',
  },
});
