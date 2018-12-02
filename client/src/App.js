import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';


class App extends Component {
  constructor(props){
    super(props)

    this.state = {
    }
  }

  componentDidMount(){
    //Make socket connection
    this.connectToSocket();
  }

  connectToSocket(){
    var socket = io.connect('http://localhost:5000');
  }

  render() {
    return (
      <div>
        Test
      </div>
    );
  }
}

export default App;
