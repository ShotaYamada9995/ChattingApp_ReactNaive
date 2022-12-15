import axios from 'axios';

import {DOMAIN} from './repository';

class FeedsRepository {
  async getInspiringVideos(page: number) {
    const endpoint = `${DOMAIN}/feed/inspiring?page=${page}&itemSize=6`;

    const response = await axios.get(endpoint);

    const badVideos = [
      '62f6d6aa4429741ade622701',
      '629f0e88e082c803e7ab3116',
      '63323e037db8560af4cdd839',
      '6325070632aa931af005a11a',
      '637b43f4625568001bff8517',
      '6379c7f0625568001bff8253',
      '63733c50f207db001b360bb5',
    ];

    const videos = response.data.filter(
      (video: any) =>
        video.file.length !== 0 &&
        video.thumbnail.length !== 0 &&
        !badVideos.includes(video._id) &&
        video.userSlug !==
          'Ugochukwu-Orga-dd601307-0e0e-4593-a724-18c76912af45',
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
