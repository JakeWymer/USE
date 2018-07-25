import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import Loading from 'react-loading-components';
import {Redirect} from 'react-router-dom';

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
      song: {},
      redirect: false,
      editing: false,
      titleEdit: '',
      keyEdit: '',
      bpmEdit: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addCollaborator = this.addCollaborator.bind(this);
    this.removeCollaborator = this.removeCollaborator.bind(this);
    this.saveSong = this.saveSong.bind(this);
    this.deleteSection = this.deleteSection.bind(this);
  }
  
  async componentDidMount() {
    let res = await axios.get('/api/currentuser');
    if(res.data.message) {
      this.setState({redirect: true});
    } else {
      axios.get(`/api/song/${this.props.match.params.id}`)
        .then(res => this.setState({
                                    song: res.data, 
                                    loading: false,
                                    titleEdit: res.data.title,
                                    keyEdit: res.data.music_key,
                                    bpmEdit: res.data.bpm
                                  }))
        .catch(err => console.log(err));
    }
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

  saveSong() {
    this.setState({loading: true, editing: false});
    let {titleEdit, keyEdit, bpmEdit} = this.state;
    axios.put(`/api/song/${this.state.song._id}`, {titleEdit, keyEdit, bpmEdit})
      .then(res => this.setState({
        song: res.data, 
        loading: false,
        titleEdit: res.data.title,
        keyEdit: res.data.music_key,
        bpmEdit: res.data.bpm
      }))
      .catch(err => console.log(err));
  }

  deleteSection(section_id) {
    axios.delete(`/api/${this.state.song._id}/${section_id}`)
      .then(res => this.setState({
        song: res.data, 
        loading: false,
        titleEdit: res.data.title,
        keyEdit: res.data.music_key,
        bpmEdit: res.data.bpm
      }))
      .catch(err => console.log(err));
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
      let collaborator = this.state.song.collaborators.find(c => c.users_id === friend.users_id);
      if(collaborator) {
        return <FriendListItem key={friend.auth_id} friend={friend} page="detail" collaborator={true} removeCollaborator={this.removeCollaborator}/>
      }
      return <FriendListItem key={friend.auth_id} friend={friend} page="detail" addCollaborator={this.addCollaborator}/>
    });

    let requests = this.props.user.currentUser.requests.map(request => {
      return <FriendListItem key={request.from.auth_id} request={request}/>
    });

    let sections = this.state.song.sections.map(section => {
      return <SectionItem 
              key={section._id} 
              section={section}
              deleteSection={this.deleteSection}/>
    });

    let songInfo = null;
    let actionBtn = null;

    if(this.state.editing) {
      songInfo = (
        <div className="song-info">
          <input 
            type="text" 
            value={this.state.titleEdit}
            onChange={this.handleChange}
            name="titleEdit"/>
          <div className="song-meta">
            <input 
              type="text" 
              value={this.state.keyEdit}
              onChange={this.handleChange}
              name="keyEdit"/>
            <input 
              type="text" 
              value={this.state.bpmEdit}
              onChange={this.handleChange}
              name="bpmEdit"/>
          </div>
        </div>
      );

      actionBtn = (
        <button
            className="edit-btn"
            onClick={this.saveSong}>
            Save
        </button>
      );
    } else {
      songInfo = (
        <div className="song-info">
          <h1>{this.state.song.title}</h1>
          <div className="song-meta">
            <p>{`Key: ${this.state.song.music_key}`}</p>
            <p>{`BPM: ${this.state.song.bpm}`}</p>
          </div>
        </div>
      );

      actionBtn = (
        <button
            className="edit-btn"
            onClick={() => this.setState({editing: true})}>
            Edit
        </button>
      );
    }



    return (
      <div className="song-detail">
        <div className="friends-panel">
          {requests}
          {friends}
        </div>
        <div className="song-panel">
          {actionBtn}
          {songInfo}
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