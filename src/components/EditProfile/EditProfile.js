import React, { Component } from 'react';
import Loading from 'react-loading-components';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import './EditProfile.css';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      redirect: false,
      name: '',
      bio: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }
  
  componentDidMount() {
    let {currentUser} = this.props.user
    if(currentUser.user_id !== parseInt(this.props.match.params.user_id, 10)) {
      this.setState({redirect: true});
    } else {
      this.setState({
        loading: false,
        name: currentUser.name,
        bio: currentUser.bio
      });
    }
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  updateProfile(e) {
    e.preventDefault();
    let {name, bio} = this.state;
    axios.put(`/api/users/${this.props.user.currentUser.user_id}`, {name, bio})
      .then(() => {
        this.setState({redirect: true});
      })
      .catch(err => console.log(err));
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
      <div>
        <form onSubmit={this.updateProfile}>
          <input 
            type="text"
            onChange={this.handleChange}
            name="name"
            value={this.state.name}/>
          <input 
            type="text"
            onChange={this.handleChange}
            name="bio"
            value={this.state.bio}/>
          <button type="submit">Save</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(EditProfile);