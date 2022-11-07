import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Button, Text, CheckBox, Input} from '@rneui/themed';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import AuthHeader from '../../components/headers/AuthHeader';
import AuthFooter from '../../components/footers/AuthFooter';
import globalStyles from '../../styles/globalStyles';
import {update} from '../../store/reducers/User';
import {WINDOW_WIDTH} from '../../utils';

const schema = yup.object().shape({
  password: yup
    .string()
    .required('Please enter your password')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      'Password must contain at least 8 characters with at least one uppercase letter, one lowercase letter, one number and one special character(allowed characters => #, ?, !, @, $, %, ^, &, *, -)',
    ),
});

const RegisterPassword = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [remember, setRemember] = useState(false);

  const genPassword = () => {
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const calpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const num = '1234567890';
    const specials = '#?!@$%^&*-';
    const options = [alpha, alpha, alpha, calpha, calpha, num, num, specials];
    let opt, choose;
    let password = '';
    for (let i = 0; i < 8; i++) {
      opt = Math.floor(Math.random() * options.length);
      choose = Math.floor(Math.random() * options[opt].length);
      password = password + options[opt][choose];
      options.splice(opt, 1);
    }

    return password;
  };

  type Values = {
    password: string;
  };
  const handleSubmit = (values: Values) => {
    // dispatch(update());
    navigation.navigate('RegisterBio');
  };

  return (
    <View style={styles.container}>
      <AuthHeader title="Verification" />

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Formik
          validationSchema={schema}
          initialValues={{password: ''}}
          onSubmit={handleSubmit}>
          {({
            handleChange,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            isSubmitting,
          }) => (
            <>
              <Text h4 style={styles.title}>
                Choose a password
              </Text>
              <Text style={styles.caption}>
                Choose a very strong password. Let's help you{' '}
                <Text
                  style={globalStyles.link}
                  onPress={() => setFieldValue('password', genPassword())}>
                  generate?
                </Text>
              </Text>

              <Input
                label="Password"
                placeholder="129***0065***tyh"
                secureTextEntry
                style={styles.inputField}
                value={values.password}
                onChangeText={handleChange('password')}
                errorMessage={errors.password}
                errorStyle={{marginTop: 20}}
                containerStyle={{marginTop: 30}}
              />

              <CheckBox
                title="Remember for 90 days"
                textStyle={{marginLeft: 0}}
                checked={remember}
                onPress={() => setRemember(current => !current)}
              />

              <View style={styles.btnContainer}>
                <Button
                  title="Cancel"
                  type="outline"
                  containerStyle={styles.btn}
                  buttonStyle={{paddingVertical: 10, borderColor: '#001433'}}
                  titleStyle={{color: '#001433'}}
                />
                <Button
                  title="Verify"
                  containerStyle={styles.btn}
                  buttonStyle={{paddingVertical: 10}}
                  color="#001433"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                />
              </View>
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
  title: {
    textAlign: 'center',
  },
  caption: {
    fontSize: WINDOW_WIDTH * 0.04,
    color: '#aaa',
    textAlign: 'center',
  },
  codeInput: {
    width: '100%',
    height: 100,
  },
  codeInputField: {
    color: '#001433',
    width: 75,
    height: 75,
    borderColor: '#001433',
    fontSize: 30,
  },
  formContainer: {
    paddingHorizontal: 10,
  },
  inputField: {
    padding: 10,
    backgroundColor: '#F1F1F1',
    borderWidth: 0,
    height: 40,
    marginBottom: -20,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn: {
    width: '45%',
    marginTop: 50,
    alignSelf: 'center',
  },
});

export default RegisterPassword;
