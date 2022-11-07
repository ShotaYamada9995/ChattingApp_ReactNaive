import axios from 'axios';

import {DOMAIN} from './repository';

class FeedsRepository {
  async getUser(userSlug: string) {
    const endpoint = `${DOMAIN}/getExpert/${userSlug}`;

    const response = await axios.get(endpoint);

    return response;
  }
}

export default new FeedsRepository();
