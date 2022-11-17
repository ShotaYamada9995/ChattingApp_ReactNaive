import axios from 'axios';

import {DOMAIN} from './repository';
import UsersRepository from './UsersRepository';

class FeedsRepository {
  async getInspiringVideos(page: number) {
    const endpoint = `${DOMAIN}/feed/inspiring?page=${page}&itemSize=6`;

    const response = await axios.get(endpoint);

    return response.data;
  }
}

export default new FeedsRepository();
