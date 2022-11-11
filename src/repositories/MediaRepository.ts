import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

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
interface CommentProps {
  mediaId: string;
  text: string;
  userSlug: string;
  mediaCommentId: string;
}
class MediaRepository {
  async getVideos(page: number) {
    const endpoint = `${DOMAIN}/media/fetchVideos?page=${page}`;

    await axios.get(endpoint);
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
          data: RNFetchBlob.wrap(file),
        },
        {
          name: 'thumbnail',
          filename: thumbnail.substring(thumbnail.lastIndexOf('/') + 1),
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

    // let mediaData = new FormData();

    // mediaData.append('file', file);
    // mediaData.append('thumbnail', thumbnail);
    // mediaData.append('community', community);
    // mediaData.append('tags', tags);
    // mediaData.append('text', text);
    // mediaData.append('userSlug', userSlug);

    // const response = await axios.post(endpoint, mediaData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //     Authorization: `${token}`,
    //   },
    //   onUploadProgress: (progressEvent: any) => {
    //     const percent = Math.round(
    //       (progressEvent.loaded * 100) / progressEvent.total,
    //     );

    //     console.log('Upload progress: ', percent);
    //   },
    // });

    // return response;
  }

  async addComment(payload: CommentProps) {
    const endpoint = `${DOMAIN}/media/comment/create`;

    await axios.post(endpoint, payload);
  }
}

export default new MediaRepository();
