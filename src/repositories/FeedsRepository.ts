import axios from 'axios';

import {DOMAIN} from './repository';

/* Issues:
 * Uncompressed which increases buffer time and data consumption
 * Bad Url which prevents loading or crashes app
 */
const badVideos = [
  '62f6d6aa4429741ade622701',
  '629f0e88e082c803e7ab3116',
  '63323e037db8560af4cdd839',
  '6325070632aa931af005a11a',
  '637b43f4625568001bff8517',
  '633c9281bc054dbe87d4ebbe',
  '633082834bb324106499b653',
  '637b43e5625568001bff8513',
  '636f93ecf207db001b360834',
  '6379c7f0625568001bff8253',
  '63733c50f207db001b360bb5',
  '6399847f9afe6a001bd4540e',
  '637b1652625568001bff8481',
  '6379e08a625568001bff834c',
  '6379ce1c625568001bff82e5',
  '6371e93df207db001b36094d',
  '63737040f207db001b360c25',
  '6371e802f207db001b360949',
  '6371e4abf207db001b3608d5',
  '6371e46af207db001b3608d1',
  '636f8cf2f207db001b3607ac',
  '636f7344f207db001b36063e',
  '636f7306f207db001b36062d',
  '63a589ee9afe6a001bd461cf',
  '63a44cf8d0b9cd0464b9d0ac',
];
class FeedsRepository {
  async getInspiringVideos(page: number) {
    const endpoint = `${DOMAIN}/feed/inspiring?page=${page}&itemSize=6`;

    const response = await axios.get(endpoint);

    const videos = response.data.filter(
      (video: any) =>
        video.file.length !== 0 &&
        video.thumbnail.length !== 0 &&
        video.file[0].cdnUrl.split('.').pop().toLowerCase() !== 'webm' &&
        !badVideos.includes(video._id),
    );

    return videos;
  }

  async getFollowingVideos(page: number) {
    const endpoint = `${DOMAIN}/feed/for-you?page=${page}&itemSize=6`;

    const response = await axios.get(endpoint);

    const videos = response.data.filter(
      (video: any) =>
        video.file.length !== 0 &&
        video.thumbnail.length !== 0 &&
        video.file[0].cdnUrl.split('.').pop().toLowerCase() !== 'webm' &&
        !badVideos.includes(video._id),
    );

    return videos;
  }
}

export default new FeedsRepository();
