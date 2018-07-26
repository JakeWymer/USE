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
      song: {},
      redirect: false,
      editing: false,
      titleEdit: '',
      keyEdit: '',
      bpmEdit: '',
      sections: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addCollaborator = this.addCollaborator.bind(this);
    this.removeCollaborator = this.removeCollaborator.bind(this);
    this.saveSong = this.saveSong.bind(this);
    this.deleteSection = this.deleteSection.bind(this);
  }
  
  async componentDidMount() {
    axios.get(`/api/song/${this.props.match.params.id}`)
      .then(res => {
        axios.get(`/api/${this.props.match.params.id}/sections`)
          .then(sections => {
            this.setState({
              song: res.data, 
              loading: false,
              titleEdit: res.data.title,
              keyEdit: res.data.music_key,
              bpmEdit: res.data.bpm,
              sections: sections.data
            })
          })
          .catch(err => console.log(err));
      })
  }

  async handleSubmit(e) {
    e.preventDefault();
    await axios.post('/api/sections', {song_id: this.state.song.song_id, title: this.state.sectionInput})
      .then(sections => {
        this.setState({sections: sections.data, sectionInput: ''})
      });
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  addCollaborator(user_id) {
    axios.post(`/api/collaborators`, {user_id, song_id: this.state.song.song_id})
      .then(song => {
          this.setState({song: song.data})
      })
      .catch(err => console.log(err));
  }

  removeCollaborator(user_id) {
    axios.delete(`/api/collaborators/${this.state.song.song_id}/${user_id}`)
      .then(song => {
        this.setState({song: song.data});  
      })
      .catch(err => console.log(err));
  }

  saveSong() {
    this.setState({loading: true, editing: false});
    let {titleEdit, keyEdit, bpmEdit} = this.state;
    axios.put(`/api/song/${this.state.song.song_id}`, {titleEdit, keyEdit, bpmEdit})
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
    axios.delete(`/api/${this.state.song.song_id}/sections/${section_id}`)
      .then(sections => {
        this.setState({sections: sections.data})
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

    let friends = this.props.user.friends.map(friend => {
      let collaborator = this.state.song.song_users.includes(friend.user_id);
      if(collaborator) {
        return <FriendListItem key={friend.auth_id} friend={friend} page="detail" collaborator={true} removeCollaborator={this.removeCollaborator}/>
      }
      return <FriendListItem key={friend.auth_id} friend={friend} page="detail" addCollaborator={this.addCollaborator}/>
    });

    let sections = this.state.sections.map(section => {
      return <SectionItem 
              key={section.section_id} 
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