import React, { Component } from 'react';
import './App.css';
import Routes from './Routes';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
require('./firebase');

class App extends Component {
  render() {
    return (
    <div className="App">
      <Header />
      <Routes />
      <Footer />
      </div>
    );
  }
}

export default App;
