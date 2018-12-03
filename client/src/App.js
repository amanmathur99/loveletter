import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';


class App extends Component {
  constructor(props){
    super(props)
    if (process.env.NODE_ENV === 'production') {
      this.state = {
        socket: io.connect(),
        message: '',
        messages: [],
        user: '',
        users: [],
        loggedIn: false
      }
    } else {
      this.state = {
        socket: io.connect('http://localhost:5000'),
        message: '',
        messages: [],
        user: '',
        users: [],
        loggedIn: false
      }
    }
  

    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleUserSubmit = this.handleUserSubmit.bind(this);

  }

  componentDidMount(){
    this.state.socket.on('new message', (data) => {
      let currentMessages = this.state.messages;
      currentMessages.push(data.msg);
      this.setState({messages: currentMessages});
    })

    this.state.socket.on('get users', (data) => {
     this.setState({users: data});
    })

    
  }

  handleMessageChange(e){
    this.setState({message: e.target.value});
  }

  handleMessageSubmit(e){
    e.preventDefault();
    console.log(this.state.message);
    //Socket send message;
    this.state.socket.emit('send message', this.state.message);
    this.setState({message: ''});
  }

  handleUserChange(e){
    this.setState({user: e.target.value});
  }

  handleUserSubmit(e){
    e.preventDefault();
    console.log(this.state.user);
    // Socket new user;
    this.state.socket.emit('new user', this.state.user, (data) => {
      if(data){
        this.setState({loggedIn: true});
      }
    });
  }



  render() {
    return (
      <div className="container">
      
      {!this.state.loggedIn ? (
      <div id="username-container">
        <form onSubmit={this.handleUserSubmit} className="user-form" > 
        <label>Enter Username</label>
          <input type="text" value={this.state.user} onChange={this.handleUserChange} className="user-form-field" ></input>
          <input type="submit" value="Submit" className="user-form-submit"></input>
        </form> 
      </div>
      ) : (
      
      <div className="chat-container" id="message-area">
        <ul className="user-list">
        Current Users
        {this.state.users.map((item,i) => <li className="users" key={i}>{item}</li>)}
        </ul>

        <ul className="message-list" > 
        {this.state.messages.map((item,i) => <li className="message" key={i}>{item}</li>)}
        </ul>

        <form onSubmit={this.handleMessageSubmit} className="message-form" > 
          <input type="text" value={this.state.message} onChange={this.handleMessageChange} className="form-field" ></input>
          <input type="submit" value="Submit" className="form-submit"></input>
        </form>

      </div>
      )}
      </div>

    );
  }
}

export default App;
