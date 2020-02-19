import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  DELETE_COMMENT,
  LOGOUT
} from './types';
import makeAuthTokenHeader from '../utils/makeAuthTokenHeader';
import TokenError from '../utils/TokenError';

// Get posts
export const getPosts = () => async dispatch => {
  try {
    const header = makeAuthTokenHeader();
    const res = await axios.get('/api/posts', header);

    dispatch({
      type: GET_POSTS,
      payload: res.data
    })
  } catch (err) {
    console.error(err);
    if (err instanceof TokenError) {

    } else if (err.response) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
  }
};

// Get post by Id
export const getPost = postId => async dispatch => {
  try {
    const header = makeAuthTokenHeader();
    const res = await axios.get(`/api/posts/${postId}`, header);
    dispatch({
      type: GET_POST,
      payload: res.data
    })
  } catch (err) {
    console.error(err);
    if (err instanceof TokenError) {
      dispatch({
        type: LOGOUT
      });
    }
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
};

// Add like
export const addLike = postId => async dispatch => {
  try {
    const header = makeAuthTokenHeader();
    const res = await axios.put(`/api/posts/like/${postId}`, null, header);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id: postId, likes: res.data }
    })
  } catch (err) {
    console.error(err);
    if (err instanceof TokenError) {
      dispatch({
        type: LOGOUT
      });
    }
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
};

// Remove like
export const removeLike = postId => async dispatch => {
  try {
    const header = makeAuthTokenHeader();
    const res = await axios.put(`/api/posts/unlike/${postId}`, null, header);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id: postId, likes: res.data }
    })
  } catch (err) {
    console.error(err);
    if (err instanceof TokenError) {
      dispatch({
        type: LOGOUT
      });
    }
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
};

// Delete post
export const deletePost = postId => async dispatch => {
  try {
    const header = makeAuthTokenHeader();
    await axios.delete(`/api/posts/${postId}`, header);

    dispatch({
      type: DELETE_POST,
      payload: postId
    });
    dispatch(setAlert('Post removed', 'success'));
  } catch (err) {
    console.error(err);
    if (err instanceof TokenError) {
      dispatch({
        type: LOGOUT
      });
    }
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
};

// Add post
export const addPost = formData => async dispatch => {
  try {
    const header = makeAuthTokenHeader();
    header['Content-Type'] = 'application/json';
    const res = await axios.post('/api/posts', formData, header);

    dispatch({
      type: ADD_POST,
      payload: res.data
    });
    dispatch(setAlert('Post created', 'success'));
  } catch (err) {
    console.error(err);
    if (err instanceof TokenError) {
      dispatch({
        type: LOGOUT
      });
    }
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
};

// Add comment
export const addComment = (postId, formData) => async dispatch => {
  try {
    const header = makeAuthTokenHeader();
    header['Content-Type'] = 'application/json';
    const res = await axios.post(`/api/posts/comment/${postId}`, formData, header);

    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    });
    dispatch(setAlert('Comment created', 'success'));
  } catch (err) {
    console.error(err);
    if (err.response) {
    if (err instanceof TokenError) {
      dispatch({
        type: LOGOUT
      });
    }
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
  }
};

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    const header = makeAuthTokenHeader();
    await axios.delete(`/api/posts/comment/${postId}/${commentId}`, header);
    console.log(`${postId} & ${commentId}`)
    const res = await axios.get(`/api/posts/${postId}`, header);

    dispatch({
      type: DELETE_COMMENT,
      payload: res.data
    });
    dispatch(setAlert('Comment removed', 'success'));

  } catch (err) {
    if (err.response) {
    console.error(err);
    if (err instanceof TokenError) {
      dispatch({
        type: LOGOUT
      });
    }
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}
};
