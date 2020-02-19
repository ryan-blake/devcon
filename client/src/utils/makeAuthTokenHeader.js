import TokenError from './TokenError';

const makeAuthTokenHeader = () => {
  const token = sessionStorage.getItem('token');
  if (token) {
    return {
      headers: {
        'x-auth-token': token
      }
    }
  } else {
    throw new TokenError('Token is missing.');
  }
}

export default makeAuthTokenHeader;
