import { AsyncStorage } from 'react-native';
import base64 from 'base-64';
import { CONFIG } from './config';

export const githubPath = p => {
  if (/^http.*/.test(p)) {
    return p;
  }

  return CONFIG.BASE_URL + p;
}

const extractCode = res => {
  return {
    code: res.status,
    res
  }
}

export const _fetch = async (path, headerOptions) => {
  const normalFetch = fetch(path, headerOptions);
  const res = await normalFetch.then(extractCode);
  const response = res.code == 204 ? {} : await res.res.json();
  if (res.code < 300) {
    return response
  } else {
    throw new Error(`${res.code} ${response.message}`)
  }
}

export const getOauthHeader = async () => {
  let user = await AsyncStorage.getItem('@githubClient:user');
  if (!user) return {};
  user = JSON.parse(user);

  // const bytes = user.login + ':' + user.token;
  // const encoded = base64.encode(bytes);

  return {
    'Authorization': 'token ' + user.token,
    'User-Agent': 'RNGithubClient',
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json; charset=utf-8'
  };
};