import axios from 'axios';

import {DOMAIN} from './repository';

export const validateEmail = async (email: string) => {
  const endpoint = `${DOMAIN}/auth/emailValidate`;

  const response = await axios.post(endpoint, {email});

  return response;
};

export const sendOtp = async (email: string) => {
  const endpoint = `${DOMAIN}/auth/otp`;

  const response = await axios.post(endpoint, {email});

  return response;
};

export const validateOtp = async (email: string, otp: string) => {
  const endpoint = `${DOMAIN}/auth/otpValidate`;

  const response = await axios.post(endpoint, {email, otp});

  return response;
};

interface User {
  email: string;
  password: string;
  expertise: string;
  firstName: string;
  lastName: string;
  otp: string;
}

export const register = async (user: User) => {
  const endpoint = `${DOMAIN}/auth/register2`;

  const response = await axios.post(endpoint, user);

  return response;
};
