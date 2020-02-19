import React from 'react';
//get state reaction with redux
import { connect } from 'react-redux';
import PropTypes from 'prop-types';



const Alert = ({ alerts }) => alerts !== null && alerts.length > 0 && alerts.map(alert => (
  <div key={alert.id} className={`alert alert-${alert.alertType}`}>
  {alert.msg}
  </div>
))

  Alert.propTypes = {
    alerts: PropTypes.array.isRequired
  }

  const mapStateToProps = state => ({
    alerts:state.alert
  })
  export default connect(mapStateToProps)(Alert)
