import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import Loading from 'react-loading-components';
import {Redirect} from 'react-router-dom';

import {setCurrentUser, setFriends} from '../../ducks/userReducer'
import FriendListItem from '../FriendListItem/FriendListItem';
import './Dashboard.css';
import SongItem from '../SongItem/SongItem';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      redirect: false,
      songInput: '',
      songs: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  async componentDidMount() {
    let res = await axios.get('/api/currentuser');
    if(res.data.message) {
      this.setState({redirect: true});
    } else {
      this.props.setCurrentUser(res.data);

      this.setState({loading: false});

      axios.get(`/api/songs/${this.props.user.currentUser._id}`)
        .then(songs => {
          this.setState({loading: false, songs: songs.data});
        })
      // axios.get(`/api/friends/${this.props.user.currentUser.users_id}`)
      //   .then((friends) => {
      //     this.props.setFriends(friends.data);
      //   })
      //   .catch(err => console.log(err));
      // axios.get(`/api/songs/${this.props.user.currentUser.users_id}`)
      //   .then(songs => {
      //     console.log(songs);
      //     this.setState({loading: false, songs: songs.data});
      //   })
      //   .catch(err => console.log(err))
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    let songs = await axios.post('/api/songs', {name: this.state.songInput});
    console.log(songs);
    this.setState({songs: songs.data, songInput: ''});
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  render() {
    if(this.state.redirect) {
      return <Redirect to="/"/>
    }

    if(this.state.loading) {
      return(
        <div className="loading-wrap">
          <Loading type='tail_spin' width={100} height={100} fill='#f44242' />
        </div>
      );
    }

    let friends = this.props.user.currentUser.friends.map(friend => {
      return <FriendListItem key={friend.auth_id} friend={friend}/>
    });

    let requests = this.props.user.currentUser.requests.map(request => {
      return <FriendListItem key={request.from.auth_id} request={request}/>
    });

    let songs = this.state.songs.map(song => {
      return <SongItem key={song._id} song={song}/>
    });

    return (
      <div className="dashboard">
        <div className="friends-panel">
          {requests}
          {friends}
        </div>
        <div className="songs-panel">
          <form onSubmit={this.handleSubmit}>
            <input 
              type="text"
              name="songInput"
              value={this.state.songInput}
              onChange={this.handleChange}/>
            <button>Create Song</button>
          </form>
          {songs}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, {setCurrentUser, setFriends})(Dashboard);