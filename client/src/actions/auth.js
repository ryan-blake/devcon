import axios from 'axios'
import {
  REGISTER_SUCCESS, REGISTER_FAIL,USER_LOADED,AUTH_ERROR,LOGIN_SUCCESS,LOGIN_FAIL, LOGOUT, CLEAR_PROFILE,TWITTER_USER
} from './types'
import {setAlert} from './alert'
import setAuthToken from '../utils/setAuthToken'

// load User
export const loadUser = () => async dispatch => {
  if(sessionStorage.token) {
    try {
    setAuthToken(sessionStorage.token);
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    })
  }catch(err){
    console.log(JSON.stringify(err))
    dispatch({
      type: AUTH_ERROR
    })

  }
}
}

//Register User

export const register = ({name, email, password}) => async dispatch => {
  const config = {
    headers: {
      'Content-Type':'application/json'
    }
  }
  const body = JSON.stringify({name,email,password});
  try {
    const res = await axios.post('/api/users', body, config)
    dispatch({
      type:REGISTER_SUCCESS,
      payload: res.data
    })
    dispatch(loadUser())

  } catch (err) {
    console.error(err.msg)
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg), 'danger'))
    }

    dispatch({
      type:REGISTER_FAIL,
    })
  }
}

//Login User

export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post('/api/auth', body, config);
    sessionStorage.setItem('token', res.data.token);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    })
    dispatch(loadUser())
  } catch (err) {
    console.log(err.response)
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    sessionStorage.removeItem('token');
    dispatch({
      type: LOGIN_FAIL
    });
  }
}

export const verifyTwitter = () => async dispatch => {
    try {
    const res = await axios.get('/api/auth/twitter');
    dispatch({
      type: TWITTER_USER,
      payload: res.data
    })
  }catch(err){
    console.log(JSON.stringify(err))
    dispatch(setAlert("CANNOT VERIFY TWITTER"), 'danger')

  }
  console.log('ran')
}

//Logout / clear / user

export const logout = () => dispatch => {
  dispatch({type:CLEAR_PROFILE})
  dispatch({type:LOGOUT})
}
