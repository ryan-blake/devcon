import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPost } from '../../actions/post';
import PostItem from '../Posts/PostItem';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = ({ getPost,pgloading, post: { post, loading}, match }) => {

  useEffect(() => {
    getPost(match.params.id);
  }, [getPost, match.params.id])


  return (
      <Fragment>
        <Link to='/posts' className='btn'>
          Back To Posts
        </Link>
        {post !== null &&
          (<Fragment>
          <PostItem post={post} showActions={false} />
        <CommentForm postId={post._id} />
        <div className="comments">
          {post.comments ? post.comments.map(comment => (
            <CommentItem key={comment._id} comment={comment} postId={post._id} />
          )) : null}
        </div>
        </Fragment>
        )
        }
      </Fragment>
  )
};

Post.defaultProps = {
  post: {},
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(mapStateToProps, { getPost })(Post);
