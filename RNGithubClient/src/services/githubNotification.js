import _ from 'lodash';

import { _fetch, githubPath, getOauthHeader } from './helper';

export const getNotification = async (before) => {
  return await _fetch(githubPath(`/notifications` + (before ? `?before=${before}` : '')), {
    method: 'GET',
    headers: _.assign({}, await getOauthHeader(), {
    })
  });
};
