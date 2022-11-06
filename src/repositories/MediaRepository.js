import axios from 'axios';

import {DOMAIN} from './repository';

class MediaRepository {
  constructor(callback) {
    this.callback = callback;
  }

  async getVideos(page) {
    const endpoint = `${DOMAIN}/media/fetchVideos?page=${page}`;

    const response = await axios.get(endpoint);

    return response;
  }
}

export default new MediaRepository();
