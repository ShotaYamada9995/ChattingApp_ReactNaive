import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Input, Button, Icon} from '@rneui/themed';
import {Formik} from 'formik';
import * as yup from 'yup';

import AuthHeader from '../../components/headers/AuthHeader';
import AuthFooter from '../../components/footers/AuthFooter';
import {useNavigation} from '@react-navigation/native';

import {update} from '../../store/reducers/Auth';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email')
    .required('Please enter your email'),
});

const RegisterEmail = () => {
  const navigation = useNavigation();

  type Values = {
    email: string;
  };
  const submit = (values: Values) => {
    update({email: values.email});

    navigation.navigate('VerifyEmail');
  };
  return (
    <View style={styles.container}>
      <AuthHeader
        title="Email sign-up"
        caption="Please enter your details to sign up with WhatIDo"
      />

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Formik
          validationSchema={schema}
          initialValues={{email: ''}}
          onSubmit={submit}>
          {({handleChange, handleSubmit, values, errors, isSubmitting}) => (
            <>
              <Input
                label="Email"
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

              <Button
                title="Next"
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

      <AuthFooter action="Log in" />
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
  btn: {
    width: '80%',
    marginTop: 50,
    alignSelf: 'center',
  },
});

export default RegisterEmail;
