import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setCurrentUser} from '../../ducks/userReducer';
import SearchBar from '../SearchBar/SearchBar';
import './Header.css';

class Header extends Component {
  render() {
    let headerContent = null;
    let input = null;

    if(this.props.user.currentUser.users_id) {
      headerContent = (
        <nav>
          <p>Profile</p>
          <a onClick={() => this.props.setCurrentUser(false)} href={process.env.REACT_APP_LOGOUT_URL}>Log Out</a>
        </nav>
      );
      input = (
        <input type="text"/>
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
        <SearchBar />
        {headerContent}
      </header>
    );
  }
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, {setCurrentUser})(Header);