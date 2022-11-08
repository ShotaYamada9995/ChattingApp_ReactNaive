import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text, Input, CheckBox, Button, Icon} from '@rneui/themed';
import {Formik} from 'formik';
import * as yup from 'yup';

import AuthHeader from '../../components/headers/AuthHeader';
import AuthFooter from '../../components/footers/AuthFooter';

import globalStyles from '../../styles/globalStyles';

import AuthRepository from '../../repositories/AuthRepository';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {login} from '../../store/reducers/Auth';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email')
    .required('Please enter your email'),
  password: yup
    .string()
    .required('Please enter your password')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      'Password must contain at least 8 characters with at least one uppercase letter, one lowercase letter, one number and one special character(allowed characters => #, ?, !, @, $, %, ^, &, *, -)',
    ),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  type Values = {
    email: string;
    password: string;
  };

  const handleSubmit = async (values: Values) => {
    setIsSubmitting(true);

    try {
      const user = await AuthRepository.login(values);
      console.log(user);

      const currentTime = Math.round(Date.now() / 1000);
      const loginDuration = 86400 * 90;
      const loginExpiryDate = currentTime + loginDuration;

      // dispatch(login({...user, loginExpiryDate}));
    } catch (error) {
      console.log('Login Error');
      console.error(error);
      setIsSubmitting(false);
    }
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
          initialValues={{email: '', password: ''}}
          onSubmit={handleSubmit}>
          {({handleChange, handleSubmit, values, errors}) => (
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

              <Input
                label="Password"
                placeholder="129***0065***tyh"
                secureTextEntry
                style={{...styles.inputField, marginBottom: -20}}
                value={values.password}
                onChangeText={handleChange('password')}
                errorMessage={errors.password}
                errorStyle={{marginTop: 20}}
              />

              <View style={styles.formBottom}>
                <CheckBox
                  title="Remember for 90 days"
                  textStyle={{marginLeft: 0}}
                  checked={remember}
                  onPress={() => setRemember(current => !current)}
                />
                <Text style={globalStyles.link}>Forgot Password?</Text>
              </View>

              <Button
                title="Login"
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

      <AuthFooter action="Sign Up" />
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

export default LoginForm;
