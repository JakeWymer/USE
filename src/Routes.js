import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import SongDetail from './components/SongDetail/SongDetail';
import SectionDetail from './components/SectionDetail/SectionDetail';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/song/:id" component={SongDetail}/>
        <Route path="/section/:id" component={SectionDetail} />
      </Switch>
    );
  }
}

export default Routes;