import axios from 'axios';

import {DOMAIN} from './repository';

interface LikeUnlikePayload {
  id: string;
  userSlug: string;
}

interface UploadMediaProps {
  file: string;
  thumbnail: string;
  community: string;
  tags: string[];
  text: string;
  userSlug: string;
}
class MediaRepository {
  async getVideos(page: number) {
    const endpoint = `${DOMAIN}/media/fetchVideos?page=${page}`;

    await axios.get(endpoint);
  }

  async likeVideo(payload: LikeUnlikePayload) {
    const endpoint = `${DOMAIN}/media/likeVideo`;

    const response = await axios.post(endpoint, payload);

    return response;
  }

  async unlikeVideo(payload: LikeUnlikePayload) {
    const endpoint = `${DOMAIN}/media/unlikeVideo`;

    await axios.post(endpoint, payload);
  }

  async uploadMedia(payload: UploadMediaProps) {
    const endpoint = `${DOMAIN}/media/create`;

    const handleProgressEvent = (progressEvent: any) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );

      console.log('Upload progress: ', percent);
    };

    const response = await axios.post(endpoint, payload, {
      onUploadProgress: handleProgressEvent,
    });

    return response;
  }
}

export default new MediaRepository();
