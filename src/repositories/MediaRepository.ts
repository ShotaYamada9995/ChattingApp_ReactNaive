import axios from 'axios';
import * as mime from 'react-native-mime-types';
import SInfo from 'react-native-sensitive-info';

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

    const token = await SInfo.getItem('userToken', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    });

    await axios.post(endpoint, payload, {
      headers: {
        Authorization: token,
      },
    });
  }

  async unlikeVideo(payload: LikeUnlikePayload) {
    const endpoint = `${DOMAIN}/media/unlikeVideo`;

    const token = await SInfo.getItem('userToken', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    });

    await axios.post(endpoint, payload, {
      headers: {
        Authorization: token,
      },
    });
  }

  async uploadMedia(payload: UploadMediaProps, setUploadProgress: any) {
    const {file, thumbnail, community, tags, text, userSlug} = payload;

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

    const token = await SInfo.getItem('userToken', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    });

    await axios.post(endpoint, mediaData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token,
      },
      onUploadProgress: progressEvent => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );

        setUploadProgress(50 + progress / 2);
      },
    });
  }

  async getComments(payload: GetCommentProps) {
    const endpoint = `${DOMAIN}/media/page/comment/${payload.id}?page=${payload.page}`;

    const response = await axios.get(endpoint);

    return response;
  }

  async addComment(payload: AddCommentProps) {
    const endpoint = `${DOMAIN}/media/comment/create`;

    const token = await SInfo.getItem('userToken', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    });

    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: token,
      },
    });

    return response;
  }

  async getPlayCount(id: string) {
    const endpoint = `${DOMAIN}/media/getPlayCount/${id}`;

    const response = await axios.get(endpoint);

    return response;
  }

  async updatePlayCount(id: string) {
    const endpoint = `${DOMAIN}/media/updatePlayCount/${id}`;

    await axios.post(endpoint);
  }
}

export default new MediaRepository();
