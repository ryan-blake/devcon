import React from 'react'
import {Link } from 'react-router-dom'
import {verifyTwitter} from '../../actions/auth'

const DashboardActions = ({verifyTwitter}) => {
  const onTwitter = async => {
      verifyTwitter()
    }
  return (
    <div className='dash-buttons'>
      <Link to='/edit-profile' className='btn btn-light'>
        <i className='fas fa-user-circle text-primary' /> Edit Profile
      </Link>
      <Link to='/add-experience' className='btn btn-light'>
        <i className='fab fa-black-tie text-primary' /> Add Experience
      </Link>
      <Link to='/add-education' className='btn btn-light'>
        <i className='fas fa-graduation-cap text-primary' /> Add Education
      </Link>
      <Link to='/posts' className='btn btn-light'>
        <i className='fas fa-graduation-cap text-primary' /> View Posts
      </Link>
      <button onClick={() => onTwitter()} className='btn btn-light'>
        <i className='fas fa-graduation-cap text-primary' /> Twitter
      </button>
    </div>
  )

}


export default DashboardActions
