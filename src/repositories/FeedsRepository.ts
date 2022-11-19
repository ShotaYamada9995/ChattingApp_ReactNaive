import axios from 'axios';

import {DOMAIN} from './repository';

class FeedsRepository {
  async getInspiringVideos(page: number) {
    const endpoint = `${DOMAIN}/feed/inspiring?page=${page}&itemSize=6`;

    const response = await axios.get(endpoint);

    return response.data;
  }

  async getFollowingVideos(page: number) {
    const endpoint = `${DOMAIN}/feed/for-you?page=${page}&itemSize=6`;

    const response = await axios.get(endpoint);

    return response.data;
  }
}

export default new FeedsRepository();
