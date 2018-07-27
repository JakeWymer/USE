import React, {Component} from 'react';
import axios from 'axios';
import Loading from 'react-loading-components';
import {connect} from 'react-redux';
import {cancelFriend} from '../../ducks/userReducer';
import './Profile.css';

class Profile extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: {},
      songs: [],
      isMe: false,
    };
  }
  
  async componentDidMount() {
    let user = await axios.get(`/api/users/${this.props.match.params.user_id}`);
    let songs = await axios.get(`/api/songs/${this.props.match.params.user_id}`);

    let isMe = false

    if(user.data[0].user_id === this.props.user.currentUser.user_id) {
      isMe = true;      
    } 

    this.setState({
      loading: false,
      user: user.data[0],
      songs: songs.data,
      isMe
    });
  }
  

  render() {
    if(this.state.loading) {
      return(
        <div className="loading-wrap">
          <Loading type='tail_spin' width={100} height={100} fill='#f44242' />
        </div>
      );
    }

    let songs = this.state.songs.map(song => {
      return(
        <div key={song.song_id}>
          <h3>{song.title}</h3>
        </div>
      );
    });

    return( 
      <div className="profile">
        <div className="profile-wrap">
          <div className="user-panel">
            <img src={this.state.user.pic_url} alt=""/>
            <h2>{this.state.user.name}</h2>
            <p>{this.state.user.bio}</p>
          </div>
          <div className="song-panel">
            {songs}
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = state => state;

export default connect(mapStateToProps, {cancelFriend})(Profile);