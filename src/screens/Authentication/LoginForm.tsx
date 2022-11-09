import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text, Input, CheckBox, Button, Icon} from '@rneui/themed';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useToast} from 'react-native-toast-notifications';

import AuthHeader from '../../components/headers/AuthHeader';
import AuthFooter from '../../components/footers/AuthFooter';

import globalStyles from '../../styles/globalStyles';

import AuthRepository from '../../repositories/AuthRepository';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {login} from '../../store/reducers/User';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email')
    .required('Please enter your email'),
  password: yup.string().required('Please enter your password'),
});

const LoginForm = () => {
  const toast = useToast();
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

      const currentTime = Math.round(Date.now() / 1000);
      const loginDuration = 86400 * 90;
      const loginExpiryDate = currentTime + loginDuration;

      dispatch(
        login({
          token: user.data.token,
          ...user.data.user,
          loginExpiryDate: remember ? loginExpiryDate : 0,
        }),
      );

      navigation.navigate('Main');

      toast.show('Login Successful', {
        type: 'success',
        duration: 2000,
      });
    } catch (error: any) {
      if (error.status === undefined) {
        toast.show(
          'Login failed. Please check your network connection and try again',
          {
            type: 'danger',
            duration: 2000,
          },
        );
      } else if (error.status === 401) {
        toast.show('Incorrect email or password', {
          type: 'danger',
          duration: 2000,
        });
      }

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
