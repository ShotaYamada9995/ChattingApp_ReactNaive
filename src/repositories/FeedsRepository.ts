import axios from 'axios';

import {DOMAIN} from './repository';
import UsersRepository from './UsersRepository';

class FeedsRepository {
  async getInspiringVideos(page: number) {
    const endpoint = `${DOMAIN}/feed/inspiring?page=${page}`;

    const response = await axios.get(endpoint);

    const videos = response.data;

    const inspiringVideos = [];

    for (let i = 0; i < videos.length; i++) {
      try {
        const {data: user} = await UsersRepository.getUser(videos[i].userSlug);

        const {data: followers} = await UsersRepository.getFollowers(
          videos[i].userSlug,
        );

        inspiringVideos.push({
          ...videos[i],
          user: {
            ...user.profile,
            image: user.imageUrl.cdnUrl,
            followers,
          },
        });
      } catch (error) {
        continue;
      }
    }

    return inspiringVideos;
  }
}

export default new FeedsRepository();
