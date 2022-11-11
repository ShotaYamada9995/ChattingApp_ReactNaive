import axios from 'axios';

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

    const response = await axios.post(
      endpoint,
      {type: payload.type, userSlug: payload.userSlug},
      {
        headers: {
          Authorization: `${payload.token}`,
        },
      },
    );
  }

  async unfollowUser(payload: any) {
    const endpoint = `${DOMAIN}/unfollow/${payload.slug}`;

    await axios.post(
      endpoint,
      {type: payload.type, userSlug: payload.userSlug},
      {
        headers: {
          Authorization: `${payload.token}`,
        },
      },
    );
  }
}

export default new FeedsRepository();
