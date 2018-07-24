import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import Loading from 'react-loading-components';

import {setCurrentUser, setFriends} from '../../ducks/userReducer'
import FriendListItem from '../FriendListItem/FriendListItem';
import './SongDetail.css';
import SectionItem from '../Sectionitem/SectionItem';

class SongDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      sectionInput: '',
      song: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addCollaborator = this.addCollaborator.bind(this);
    this.removeCollaborator = this.removeCollaborator.bind(this);
  }
  
  async componentDidMount() {
    axios.get(`/api/song/${this.props.match.params.id}`)
      .then(res => this.setState({song: res.data, loading: false}))
      .catch(err => console.log(err));
  }

  async handleSubmit(e) {
    e.preventDefault();
    await axios.post('/api/sections', {song_id: this.state.song._id, title: this.state.sectionInput})
      .then(song => {
        this.setState({song: song.data, sectionInput: ''})
      });
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  addCollaborator(user_id) {
    axios.post(`/api/collaborators`, {user_id, song_id: this.state.song._id})
      .then(song => {
          this.setState({song: song.data})
      })
      .catch(err => console.log(err));
  }

  removeCollaborator(user_id) {
    axios.delete(`/api/collaborators/${this.state.song._id}/${user_id}`)
      .then(() => {
        axios.get(`/api/song/${this.props.match.params.id}`)
          .then(res => this.setState({song: res.data}))
          .catch(err => console.log(err));  
      })
      .catch(err => console.log(err));
  }

  render() {
    if(this.state.loading) {
      return(
        <div className="loading-wrap">
          <Loading type='tail_spin' width={100} height={100} fill='#f44242' />
        </div>
      );
    }

    let friends = this.props.user.currentUser.friends.map(friend => {
      let collaborator = this.state.song.collaborators.find(c => c.users_id === friend.users_id);
      if(collaborator) {
        return <FriendListItem key={friend.auth_id} friend={friend} page="detail" collaborator={true} removeCollaborator={this.removeCollaborator}/>
      }
      return <FriendListItem key={friend.auth_id} friend={friend} page="detail" addCollaborator={this.addCollaborator}/>
    });

    let sections = this.state.song.sections.map(section => {
      return <SectionItem key={section.sections_id} section={section}/>
    });

    return (
      <div className="song-detail">
        <div className="friends-panel">
          {friends}
        </div>
        <div className="song-panel">
          <div className="song-info">
            <h1>{this.state.song.title}</h1>
            <div className="song-meta">
              <p>{`Key: ${this.state.song.music_key}`}</p>
              <p>{`BPM: ${this.state.song.bpm}`}</p>
            </div>
          </div>
          <form onSubmit={this.handleSubmit}>
            <input 
              type="text"
              name="sectionInput"
              value={this.state.sectionInput}
              onChange={this.handleChange}/>
            <button>Create Section</button>
          </form>
          {sections}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, {setCurrentUser, setFriends})(SongDetail);