import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Button, Text} from '@rneui/themed';
import OTPTextView from 'react-native-otp-textinput';

import AuthHeader from '../../components/headers/AuthHeader';
import AuthFooter from '../../components/footers/AuthFooter';
import globalStyles from '../../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import {update} from '../../store/reducers/Auth';
import {useSelector} from 'react-redux';

const VerifyEmail = () => {
  const navigation = useNavigation();
  const auth = useSelector((state: any) => state.auth);

  console.log(auth.email);

  const [code, setCode] = useState('');

  const submit = () => {
    update({otp: code});
    navigation.navigate('RegisterPassword');
  };

  return (
    <View style={styles.container}>
      <AuthHeader title="Verification" />

      <Text h4 style={styles.title}>
        Please check your email
      </Text>
      <Text style={styles.caption}>
        We've sent a code to victoriasky@gmail.com
      </Text>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <OTPTextView
          handleTextChange={code => setCode(code)}
          tintColor="#001433"
          textInputStyle={{
            width: 75,
            height: 75,
            borderWidth: 1,
            color: '#001433',
          }}
        />
        <Text>
          Didn't get a code? <Text style={globalStyles.link}>Resend</Text>
        </Text>

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
            onPress={submit}
          />
        </View>
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
    fontSize: 15,
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
    padding: 10,
    marginTop: 30,
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

export default VerifyEmail;
