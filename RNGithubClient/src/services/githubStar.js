import _ from 'lodash';

import { _fetch, githubPath, getOauthHeader } from './helper';

export const starRepo = async ({ owner, name }) => {
  return await _fetch(githubPath(`/user/starred/${owner}/${name}`), {
    method: 'PUT',
    headers: _.assign({}, await getOauthHeader(), {
      'Content-Length': 0
    })
  });
};

export const unstarRepo = async ({ owner, name }) => {
  return await _fetch(githubPath(`/user/starred/${owner}/${name}`), {
    method: 'DELETE',
    headers: _.assign({}, await getOauthHeader(), {
      'Content-Length': 0
    })
  });
};