import React from 'react';
import {connect} from 'react-redux';
import {Route, Redirect} from 'react-router-dom';

const PrivateRoute = (props) => {
  let {component: Component, user, path} = props;

  return(
    <Route path={path} render={props => {
      if(user.currentUser.user_id) {
        return <Component {...props} />
      } else {
        return <Redirect to="/" />
      }
    }} />
  );
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(PrivateRoute)