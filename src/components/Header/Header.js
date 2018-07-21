import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setCurrentUser} from '../../ducks/userReducer';
import './Header.css';

class Header extends Component {
  render() {
    let headerContent = null;

    if(this.props.user.currentUser.id) {
      headerContent = (
        <nav>
          <p>Profile</p>
          <a onClick={() => this.props.setCurrentUser(false)} href={process.env.REACT_APP_LOGOUT_URL}>Log Out</a>
        </nav>
      );
    } else {
      headerContent =(
        <nav>
          <a href={process.env.REACT_APP_LOGIN_URL}>Log In</a>
        </nav>
      );
    }

    return (
      <header>
        <div className="logo">
          <p>U.S.E</p>
        </div>
        {headerContent}
      </header>
    );
  }
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, {setCurrentUser})(Header);