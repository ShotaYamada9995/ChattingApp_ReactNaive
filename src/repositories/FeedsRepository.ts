import axios from 'axios';

import {DOMAIN} from './repository';

class FeedsRepository {
  async getInspiringVideos(page: number) {
    const endpoint = `${DOMAIN}/feed/inspiring?page=${page}`;

    const response = await axios.get(endpoint);

    return response;
  }
}

export default new FeedsRepository();
