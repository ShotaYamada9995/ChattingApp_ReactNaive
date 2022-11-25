import axios from 'axios';

import {DOMAIN} from './repository';

class DataRepository {
  async getExpertsCategoryList() {
    const endpoint = `${DOMAIN}/getExpertsCategoryList`;

    const response = await axios.get(endpoint);

    return response.data;
  }
}

export default new DataRepository();
