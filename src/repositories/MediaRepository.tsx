import axios from 'axios';

import {DOMAIN} from './repository';

export const getVideos = async () => {
  const endpoint = `${DOMAIN}/media/fetchVideos`;

  const response = await axios.get(endpoint);

  return response;
};
