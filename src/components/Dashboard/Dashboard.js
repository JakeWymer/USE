import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import Loading from 'react-loading-components';
import {Redirect} from 'react-router-dom';

import {setCurrentUser, setFriends} from '../../ducks/userReducer'
import './Dashboard.css';
import FriendListItem from '../FriendListItem/FriendListItem';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      redirect: false,
      friends: []
    };
  }
  
  async componentDidMount() {
    let res = await axios.get('/api/currentuser');
    if(res.data.message) {
      this.setState({redirect: true});
    } else {
      this.props.setCurrentUser(res.data);
      axios.get(`/api/friends/${this.props.user.currentUser.users_id}`)
        .then((friends) => {
          this.props.setFriends(friends.data);
          this.setState({loading: false});
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    if(this.state.redirect) {
      return <Redirect to="/"/>
    }

    if(this.state.loading) {
      return <Loading type='tail_spin' width={100} height={100} fill='#f44242' />
    }

    let friends = this.props.user.friends.map(friend => {
      return <FriendListItem key={friend.auth_id} friend={friend}/>
    });

    return (
      <div>
        {friends}
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, {setCurrentUser, setFriends})(Dashboard);