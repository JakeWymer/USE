import React, { Component } from 'react';
import Loading from 'react-loading-components';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import firebase from "firebase";
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import './EditProfile.css';
var uniqid = require('uniqid');

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      redirect: false,
      name: '',
      bio: '',
      profilePicUrl: '',
      compressedFile: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.compressFile = this.compressFile.bind(this);
    this.uploadToFirebase = this.uploadToFirebase.bind(this);
  }
  
  componentDidMount() {
    let {currentUser} = this.props.user
    if(currentUser.user_id !== parseInt(this.props.match.params.user_id, 10)) {
      this.setState({redirect: true});
    } else {
      this.setState({
        loading: false,
        name: currentUser.name,
        bio: currentUser.bio,
        profilePicUrl: currentUser.pic_url
      });
    }
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  updateProfile() {
    let {name, bio, profilePicUrl} = this.state;
    axios.put(`/api/users/${this.props.user.currentUser.user_id}`, {name, bio, profilePicUrl})
      .then(() => {
        this.setState({redirect: true});
      })
      .catch(err => console.log(err));
  }

  async compressFile(e) {
    const maxSizeMB = 1;
    const compressedFile = await imageCompression(e.target.files[0], maxSizeMB);
    let url = URL.createObjectURL(compressedFile);
    console.log(url);
    this.setState({profilePicUrl: url, compressedFile});
  }

  uploadToFirebase(e) {
    e.preventDefault();
    let storageRef = firebase.storage().ref();
    let fileName = uniqid();
    let uploadTask = storageRef.child(`images/${fileName}.jpg`).put(this.state.compressedFile);

    uploadTask.on('state_changed', snapshot => {
      switch (snapshot.state) {
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          this.setState({loading: true});
          break;
      }
    }, error => {
      console.log(error);
    }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
        console.log(downloadURL);
        this.setState({profilePicUrl: downloadURL});
        this.updateProfile()
      });
    });
  }

  render() {
    if(this.state.redirect) {
      return <Redirect to="/dashboard" />
    }

    if(this.state.loading) {
      return(
        <div className="loading-wrap">
          <Loading type='tail_spin' width={100} height={100} fill='#f44242' />
        </div>
      );
    }

    return (
      <div className="edit-profile-wrap">
        <form onSubmit={this.uploadToFirebase}>
          <div>
            <img src={this.state.profilePicUrl} alt=""/>
            <input type="file" name="profilePic" onChange={this.compressFile}/>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text"
              onChange={this.handleChange}
              name="name"
              id="name"
              value={this.state.name}/>
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea 
              rows="4" cols="50"
              onChange={this.handleChange}
              name="bio"
              id="bio">
              {this.state.bio}
            </textarea>
          </div>  
          <button type="submit">Save</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(EditProfile);