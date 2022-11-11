import axios from 'axios';

import {DOMAIN} from './repository';
import UsersRepository from './UsersRepository';

class FeedsRepository {
  async getInspiringVideos(page: number) {
    const endpoint = `${DOMAIN}/feed/inspiring?page=${page}`;

    const response = await axios.get(endpoint);

    const videos = response.data;

    const inspiringVideos = [];

    for (let i = 0; i < videos; i++) {
      try {
        const {data: user} = await UsersRepository.getUser(videos[i].userSlug);
        console.log(`User ${i + 1}: `, user);
        inspiringVideos.push({
          ...videos[i],
          userProfile: {...user.profile, image: user.profileImage},
        });
      } catch (error) {
        continue;
      }
    }

    console.log('Inspiring: ', inspiringVideos);

    return inspiringVideos;
  }
}

export default new FeedsRepository();
