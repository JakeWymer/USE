import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {setCurrentUser} from '../../ducks/userReducer';
import SearchBar from '../SearchBar/SearchBar';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      toggleMenu: false
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }
  
  toggleMenu() {
    this.setState({toggleMenu: !this.state.toggleMenu});
  }

  render() {
    let headerContent = null;
    let input = null;
    let show = this.state.toggleMenu ? 'show-menu' : 'hide-menu';

    if(this.props.user.currentUser.user_id) {
      headerContent = (
        <nav className={`${show}`}>
          <Link to={`/profile/${this.props.user.currentUser.user_id}`}><p>Profile</p></Link>
          <a onClick={() => this.props.setCurrentUser(false)} href={process.env.REACT_APP_LOGOUT_URL}>Log Out</a>
        </nav>
      );
      input = (
        <SearchBar />
      );
    } else {
      headerContent =(
        <nav className={`${show}`}>
          <a href={process.env.REACT_APP_LOGIN_URL}>Log In</a>
        </nav>
      );
    }

    return (
      <header>
        <div className="logo">
          <Link to="/dashboard"><p>U.S.E.</p></Link>
        </div>
        <i className="fas fa-bars menu-btn" onClick={() => this.toggleMenu()}></i>
        {input}
        {headerContent}
      </header>
    );
  }
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, {setCurrentUser})(Header);