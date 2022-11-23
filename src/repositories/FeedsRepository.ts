import axios from 'axios';

import {DOMAIN} from './repository';

class FeedsRepository {
  async getInspiringVideos(page: number) {
    const endpoint = `${DOMAIN}/feed/inspiring?page=${page}&itemSize=6`;

    const response = await axios.get(endpoint);

    const videos = response.data.filter(
      (video: any) => video.file.length !== 0 && video.thumbnail.length !== 0,
    );

    return videos;
  }

  async getFollowingVideos(page: number) {
    const endpoint = `${DOMAIN}/feed/for-you?page=${page}&itemSize=6`;

    const response = await axios.get(endpoint);

    const videos = response.data.filter(
      (video: any) => video.file.length !== 0 && video.thumbnail.length !== 0,
    );

    return videos;
  }
}

export default new FeedsRepository();
