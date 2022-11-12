import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
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

    const response = await RNFetchBlob.fetch(
      'POST',
      endpoint,
      {
        'Content-Type': 'multipart/form-data',
        Authorization: `${token}`,
      },
      [
        {
          name: 'file',
          filename: file.substring(file.lastIndexOf('/') + 1),
          type: mime.lookup(file),
          data: RNFetchBlob.wrap(file),
        },
        {
          name: 'thumbnail',
          filename: thumbnail.substring(thumbnail.lastIndexOf('/') + 1),
          type: mime.lookup(thumbnail),
          data: RNFetchBlob.wrap(thumbnail),
        },
        {name: 'community', data: community},
        {name: 'tags', data: tags},
        {name: 'text', data: text},
        {name: 'userSlug', data: userSlug},
      ],
    ).uploadProgress((written, total) => {
      console.log('Upload progress: ', written / total);
    });

    return response;
  }

  async getComments(payload: GetCommentProps) {
    const endpoint = `${DOMAIN}/media/page/comment/${payload.id}?page=${payload.page}`;

    const response = await axios.get(endpoint);

    return response;
  }

  async addComment(payload: AddCommentProps) {
    const endpoint = `${DOMAIN}/media/comment/create`;

    await axios.post(endpoint, payload);
  }
}

export default new MediaRepository();
