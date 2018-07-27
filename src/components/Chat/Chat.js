import React, { Component } from 'react';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import axios from 'axios';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      message: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);

    this.socket = io('http://localhost:5000');
  }
  
  async componentDidMount() {
    this.socket.emit("join", this.props.match.params.chat_id);
    let messages = await axios.get(`/api/messages/${this.props.match.params.chat_id}`);
    console.log(messages);
    this.setState({messages: messages.data});

    this.socket.on('message-received', (data) => {
      console.log(data);
      let m = this.state.messages;
      m.push(data);
      this.setState({messages: m});
    });
  }

  handleChange(e) {
    this.setState({message: e.target.value});
  }

  sendMessage(e) {
    e.preventDefault();

    let newMessage = {
      body: this.state.message, 
      chatId: this.props.match.params.chat_id, 
      user_id: this.props.user.currentUser.user_id
    }

    let messages = [...this.state.messages, newMessage];

    this.setState({messages, message: ''});

    this.socket.emit("message",  newMessage);
  }

  render() {
    let messages = this.state.messages.map((message, i) => {
      if(message.user_id !== this.props.user.currentUser.user_id){
        return <h2 key={i} className="received-message">{message.body}</h2>
      } else {
        return <h2 className="sent-message">{message.body}</h2>
      }
    });

    return (
      <div>
        CHAT
        {messages}
        <form 
          onSubmit={this.sendMessage}>
          <input 
            type="text"
            onChange={this.handleChange}
            value={this.state.message}/>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(Chat);