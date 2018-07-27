import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import SongDetail from './components/SongDetail/SongDetail';
import SectionDetail from './components/SectionDetail/SectionDetail';
import Profile from './components/Profile/Profile';
import Chat from './components/Chat/Chat';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/song/:id" component={SongDetail}/>
        <PrivateRoute path="/section/:id" component={SectionDetail} />
        <PrivateRoute path="/profile/:user_id" component={Profile} />
        <PrivateRoute path="/chat/:chat_id" component={Chat} />
      </Switch>
    );
  }
}

export default Routes;