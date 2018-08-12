import React from 'react';
import './Home.css';

const musicImage = require('../../assets/Music_Elements.png');

const Home = props => {
  return (
    <div>
      <section id="hero">
        <h1>U.S.E.</h1>
        <h2>Ultimate Songwriting Experience</h2>
        <button className="sign-up-btn"><a href={process.env.REACT_APP_LOGIN_URL}>Sign Up</a></button>
        <img src={musicImage} alt=""/>
      </section>  
      <section id="features">
        <div className="feature-item">
          <i className="fas fa-user-friends fa-5x"></i>
          <h3>Collaborate</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio quas consectetur cupiditate animi corrupti maiores ullam, sunt quod porro obcaecati beatae debitis tempora nemo nobis at reiciendis vero iste voluptate.
          </p>
        </div>
        <div className="feature-item">
          <i className="fas fa-music fa-5x"></i>
          <h3>Create</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio quas consectetur cupiditate animi corrupti maiores ullam, sunt quod porro obcaecati beatae debitis tempora nemo nobis at reiciendis vero iste voluptate.
          </p>
        </div>
        <div className="feature-item">
          <i className="fas fa-lightbulb fa-5x"></i>
          <h3>Inspire</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio quas consectetur cupiditate animi corrupti maiores ullam, sunt quod porro obcaecati beatae debitis tempora nemo nobis at reiciendis vero iste voluptate.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;