import base64 from 'base-64';
import { _fetch, CONFIG, githubPath } from './helper';
import { CONFIG } from './config';

export const basicLogin = async (username, pwd, tfaToken) => {
  const bytes = username.trim() + ':' + pwd.trim();
  const encoded = base64.encode(bytes);

  return await _fetch(githubPath('/authorizations'), {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + encoded,
      'User-Agent': 'RNGithubClient',
      'Content-Type': 'application/json; charset=utf-8',
      'X-GitHub-OTP': tfaToken
    },
    body: JSON.stringify({
      'client_id': CONFIG.GITHUB_CLIENT_ID,
      'client_secret': CONFIG.GITHUB_CILENT_SECRET,
      'scopes': CONFIG.SCOPES,
      'note': 'rn-github-client'
    })
  });
};

export const checkToken = async (login, token) => {
  const bytes = CONFIG.GITHUB_CLIENT_ID + ':' + CONFIG.GITHUB_CILENT_SECRET;
  const encoded = base64.encode(bytes);

  return await _fetch(githubPath(`/applications/${CONFIG.GITHUB_CLIENT_ID}/tokens/${token}`), {
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + encoded,
      'User-Agent': 'RNGithubClient',
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
};