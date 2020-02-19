import axios from 'axios'

const setAuthToken = (token) => {
  if(token){
    axios.defaults.headers.common['x-auth-token'] = token
    if (token === false) {
      // delete axios.defaults.headers.common['x-auth-token'];
    }
  } else {
  }
}

export default setAuthToken
