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
      songs: [],
      friendsShouldShow: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleFriends = this.toggleFriends.bind(this);
  }
  
  async componentDidMount() {
    let res = await axios.get('/api/currentuser');
    if(res.data.message) {
      this.setState({redirect: true});
    } else {
      this.props.setCurrentUser(res.data);

      let friends = await axios.get('/api/friends');
      this.props.setFriends(friends.data);
    
      axios.get(`/api/songs/${this.props.user.currentUser.user_id}`)
        .then(songs => {
          console.log(songs);
          this.setState({loading: false, songs: songs.data});
        })
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

  toggleFriends() {
    this.setState({friendsShouldShow: !this.state.friendsShouldShow});
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

    let friends = this.props.user.friends.map(friend => {
      return <FriendListItem key={friend.auth_id} friend={friend}/>
    });

    let songs = this.state.songs.map(song => {
      return <SongItem key={song.song_id} song={song}/>
    });

    let songsDisplay = 'songs-show';
    let friendsDisplay = 'friends-hide';

    if(this.state.friendsShouldShow) {
      songsDisplay = 'songs-hide';
      friendsDisplay = 'friends-show';
    }

    return (
      <div className="dashboard">
        <div className={`friends-panel ${friendsDisplay}`}>
          {friends}
          <i 
            class="fa fa-times fa-3x open-friends-btn"
            onClick={this.toggleFriends}></i>
        </div>
        <div className={`songs-panel ${songsDisplay}`}>
          <form onSubmit={this.handleSubmit}>
            <input 
              type="text"
              name="songInput"
              value={this.state.songInput}
              onChange={this.handleChange}/>
            <button>Create Song</button>
          </form>
          {songs}
          <i 
            class="fa fa-user-friends fa-3x open-friends-btn"
            onClick={this.toggleFriends}></i>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, {setCurrentUser, setFriends})(Dashboard);