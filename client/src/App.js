import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';


class App extends Component {
  constructor(props){
    super(props)

    if (process.env.NODE_ENV === 'production') {
      this.state = {
        socket: io.connect('https://loveletter-na.herokuapp.com:5000'),
        message: '',
        messages: []
      }
    } else {
      this.state = {
        socket: io.connect('http://localhost:5000'),
        message: '',
        messages: []
      }
    }
  

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidMount(){
    this.state.socket.on('new message', (data) => {
      let currentMessages = this.state.messages;
      currentMessages.push(data.msg);
      this.setState({messages: currentMessages});
    })
  }

  handleChange(e){
    this.setState({message: e.target.value});
  }

  handleSubmit(e){
    e.preventDefault();
    console.log(this.state.message);

    //Socket send message;
    this.state.socket.emit('send message', this.state.message);
    this.setState({message: ''});
  }



  render() {
    return (
      <div id="chat-container">
        <ul className="user-list" id="users"></ul>
        <ul className="message-list" id="Messages">
        
        {this.state.messages.map((item,i) => <li key={i}>{item}</li>)}


        </ul>


        <form onSubmit={this.handleSubmit}>
         
          <label>Message:
          <input type="text" value={this.state.message} onChange={this.handleChange} ></input>
          </label>

          <input type="submit" value="Submit"></input>
        </form>

      </div>
    );
  }
}

export default App;
