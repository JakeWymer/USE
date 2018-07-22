import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import SearchItem from '../SearchItem/SearchItem';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      users: [],
      filteredUsers: [],
      search: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }
  
  async componentDidMount() {
    let users = await axios.get('/api/users');
    this.setState({users: users.data, filteredUsers: users.data});
  }

  handleChange(e) {
    let filteredUsers = this.state.users.slice().filter(user => {
      return user.name.toLowerCase().includes(e.target.value);
    });
    this.setState({[e.target.name]: e.target.value, filteredUsers});
  }

  render() {
    let filtered = null;

    if(this.state.search.length > 0) {
      filtered = this.state.filteredUsers.map(user => {
        if(user.auth_id !== this.props.user.currentUser.auth_id){
          return(
            <SearchItem 
              person={user} 
              addFriend={this.addFriend}
              key={user.auth_id}/>
          );
        }
        return null;
      });
    }

    return (
      <div>
        <input 
          type="text"
          value={this.state.search}
          name="search"
          onChange={this.handleChange}/>
        <div>
          {filtered}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(SearchBar);