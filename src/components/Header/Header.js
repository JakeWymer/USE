import React from 'react';
import './Header.css';

const Header = () => {
  let loggedIn = true;
  let headerContent = null;

  if(loggedIn) {
    headerContent = (
      <nav>
        <p>Profile</p>
        <p>Log Out</p>
      </nav>
    );
  } else {
    headerContent = (
      <nav>
        <p>Log In</p>
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
};

export default Header;