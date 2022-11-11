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
}

export default new FeedsRepository();
