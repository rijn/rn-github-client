import _ from 'lodash';

import { _fetch, githubPath, getOauthHeader } from './helper';

export const followUser = async (login) => {
  return await _fetch(githubPath(`/user/following/${login}`), {
    method: 'PUT',
    headers: _.assign({}, await getOauthHeader(), {
      'Content-Length': 0
    })
  });
};

export const unfollowUser = async (login) => {
  return await _fetch(githubPath(`/user/following/${login}`), {
    method: 'DELETE',
    headers: _.assign({}, await getOauthHeader(), {
      'Content-Length': 0
    })
  });
};