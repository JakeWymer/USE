import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import Loading from 'react-loading-components';
import {Redirect} from 'react-router-dom';

import {setCurrentUser} from '../../ducks/userReducer'
import './Dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      redirect: false
    };
  }
  
  async componentDidMount() {
    let res = await axios.get('/api/currentuser');
    if(res.data.message) {
      this.setState({redirect: true});
    } else {
      this.props.setCurrentUser(res.data);
      console.log(this.props);
      this.setState({loading: false});
    }
  }

  render() {
    if(this.state.redirect) {
      return <Redirect to="/"/>
    }

    if(this.state.loading) {
      return <Loading type='tail_spin' width={100} height={100} fill='#f44242' />
    }

    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, {setCurrentUser})(Dashboard);