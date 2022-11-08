import axios from 'axios';

import {DOMAIN} from './repository';

interface User {
  email: string;
  password: string;
  expertise: string;
  firstName: string;
  lastName: string;
  otp: string;
}
class AuthRepository {
  async validateEmail(email: string) {
    const endpoint = `${DOMAIN}/auth/emailValidate`;

    const response = await axios.post(endpoint, {email});

    return response;
  }

  async sendOtp(email: string) {
    const endpoint = `${DOMAIN}/auth/otp`;

    const response = await axios.post(endpoint, {email});

    return response;
  }

  async validateOtp(email: string, otp: string) {
    const endpoint = `${DOMAIN}/auth/otpValidate`;

    const response = await axios.post(endpoint, {email, otp});

    return response;
  }

  async register(user: User) {
    const endpoint = `${DOMAIN}/auth/register2`;

    const response = await axios.post(endpoint, user);

    return response;
  }
}

export default new AuthRepository();
