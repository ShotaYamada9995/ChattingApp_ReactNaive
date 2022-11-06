import axios from 'axios';

import {DOMAIN} from './repository';

export const getVideos = async (page: number) => {
  const endpoint = `${DOMAIN}/media/fetchVideos?page=${page}`;

  const response = await axios.get(endpoint);

  return response;
};
