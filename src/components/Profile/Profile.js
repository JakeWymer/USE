import React, {Component} from 'react';
import axios from 'axios';
import Loading from 'react-loading-components';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {cancelFriend} from '../../ducks/userReducer';
import SongItem from '../SongItem/SongItem';
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
  
  componentDidMount() {
    this.fetchProfile()
  }
  
  componentDidUpdate(prevProps) {
    if(prevProps !== this.props) {
      this.setState({loading: true});
      this.fetchProfile();
    }
  }

  async fetchProfile() {
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
    console.log(this.state.isMe);
    if(this.state.loading) {
      return(
        <div className="loading-wrap">
          <Loading type='tail_spin' width={100} height={100} fill='#f44242' />
        </div>
      );
    }

    let editBtn = null;

    if(this.state.isMe) {
      editBtn = <Link to={`/edit/${this.props.user.currentUser.user_id}`} className="edit-link"><button className="edit-btn">Edit Profile</button></Link>
    }

    let songs = this.state.songs.map(song => {
      return(
        <SongItem 
          key={song.song_id} 
          song={song}
          protected/>
      );
    });

    return( 
      <div className="profile">
        <div className="profile-wrap">
          <div className="user-panel">
            {editBtn}
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
