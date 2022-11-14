import axios from 'axios';
import * as mime from 'react-native-mime-types';

import {DOMAIN} from './repository';

interface LikeUnlikePayload {
  id: string;
  userSlug: string;
}

interface UploadMediaProps {
  token: string;
  file: string;
  thumbnail: string;
  community: string;
  tags: string[];
  text: string;
  userSlug: string;
}

interface GetCommentProps {
  id: string;
  page: number;
}
interface AddCommentProps {
  mediaId: string;
  text: string;
  userSlug: string;
  mediaCommentId: string;
}
class MediaRepository {
  async getVideos(page: number) {
    const endpoint = `${DOMAIN}/media/fetchVideos?page=${page}`;

    const response = await axios.get(endpoint);

    return response;
  }

  async likeVideo(payload: LikeUnlikePayload) {
    const endpoint = `${DOMAIN}/media/likeVideo`;

    await axios.post(endpoint, payload);
  }

  async unlikeVideo(payload: LikeUnlikePayload) {
    const endpoint = `${DOMAIN}/media/unlikeVideo`;

    await axios.post(endpoint, payload);
  }

  async uploadMedia(payload: UploadMediaProps) {
    const {token, file, thumbnail, community, tags, text, userSlug} = payload;

    const endpoint = `${DOMAIN}/media/create`;

    const mediaData = new FormData();

    mediaData.append('file', {
      uri: file,
      type: mime.lookup(file),
      name: file.substring(file.lastIndexOf('/') + 1),
    });
    mediaData.append('thumbnail', {
      uri: thumbnail,
      type: mime.lookup(thumbnail),
      name: thumbnail.substring(thumbnail.lastIndexOf('/') + 1),
    });
    mediaData.append('community', community);
    mediaData.append('tags', tags);
    mediaData.append('text', text);
    mediaData.append('userSlug', userSlug);

    const response = await axios.post(endpoint, mediaData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `${token}`,
      },
      onUploadProgress: progressEvent => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );

        console.log('Progress: ', percent);
      },
    });

    return response;
  }

  async getComments(payload: GetCommentProps) {
    const endpoint = `${DOMAIN}/media/page/comment/${payload.id}?page=${payload.page}`;

    const response = await axios.get(endpoint);

    return response;
  }

  async addComment(token: string, payload: AddCommentProps) {
    const endpoint = `${DOMAIN}/media/comment/create`;

    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return response;
  }
}

export default new MediaRepository();
