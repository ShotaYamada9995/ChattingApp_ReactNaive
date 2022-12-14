import axios from 'axios';
import SInfo from 'react-native-sensitive-info';

import {DOMAIN} from './repository';
class FeedsRepository {
  async getUser(userSlug: string) {
    const endpoint = `${DOMAIN}/getExpert/${userSlug}`;

    const response = await axios.get(endpoint);

    return response;
  }

  async getFollowers(userSlug: string) {
    const endpoint = `${DOMAIN}/follwers/${userSlug}`;

    const response = await axios.get(endpoint);

    return response;
  }

  async getFollowing(userSlug: string) {
    const endpoint = `${DOMAIN}/following/${userSlug}`;

    const response = await axios.get(endpoint);

    return response;
  }

  async followUser(payload: any) {
    const endpoint = `${DOMAIN}/follow/${payload.slug}`;

    const token = await SInfo.getItem('userToken', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    });

    await axios.post(
      endpoint,
      {type: payload.type, userSlug: payload.userSlug},
      {
        headers: {
          Authorization: token,
        },
      },
    );
  }

  async unfollowUser(payload: any) {
    const endpoint = `${DOMAIN}/unfollow/${payload.slug}`;

    const token = await SInfo.getItem('userToken', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    });

    await axios.post(
      endpoint,
      {type: payload.type, userSlug: payload.userSlug},
      {
        headers: {
          Authorization: token,
        },
      },
    );
  }
}

export default new FeedsRepository();
