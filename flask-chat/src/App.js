import React, { Component } from 'react';
import './App.css';
import socketIOClient from "socket.io-client";

class App extends Component {
  host = process.env.REACT_APP_HOST_ADDRESS;
  port = process.env.REACT_APP_HOST_PORT;
  server = 'http://' + this.host + ':' + this.port;

  constructor(props) {
    super(props);
    this.state = {
      receivedMessages: [],
      username: '',
      message: '',
      messageSent: { username: '', message: '' },
      update: ''
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.loadMessages();
    this.loadSocket();
  }

  loadSocket() {
    const socket = socketIOClient(this.server);
    socket.on('message', messageFromSocket => {
      this.renderMessageFromSocket(messageFromSocket);
    });
  }

  loadMessages() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.server + '/chat');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.setState({
          receivedMessages: JSON.parse(xhr.responseText)
        })
      }
    };
    xhr.send();
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });

  }

  handleMessageChange(event) {
    this.setState({ message: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch(this.server + '/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({ 'username': this.state.username, 'message': this.state.message })
    });
  }

  renderMessageFromSocket(messageFromSocket) {
    this.setState({ update: 'updating' });
    this.setState(state => {
      for (let index = 0; index < state.receivedMessages.length - 1; index++) {
        const currentUsername = state.receivedMessages[index][1];
        state.receivedMessages[index][1] = state.receivedMessages[index + 1][1];
        state.receivedMessages[index + 1][1] = currentUsername;
        const currentMessage = state.receivedMessages[index][2];
        state.receivedMessages[index][2] = state.receivedMessages[index + 1][2];
        state.receivedMessages[index + 1][2] = currentMessage;
        const currentTimestamp = state.receivedMessages[index][3];
        state.receivedMessages[index][3] = state.receivedMessages[index + 1][3];
        state.receivedMessages[index + 1][3] = currentTimestamp;
      }
      state.receivedMessages[19][1] = messageFromSocket.username;
      state.receivedMessages[19][2] = messageFromSocket.message;
      state.receivedMessages[19][3] = new Date(Date.now()).toGMTString();
    });
    this.forceUpdate();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <ul className="chat-window">
            {this.state.receivedMessages.map((currentMessage, i) => {
              return <li key={currentMessage[0]}>
                <div className="chat-data">
                  <div className="chat-username-message">
                    <div className="username-container">
                      <span className={`username-text-${i}`}> {currentMessage[1]} </span>
                    </div>
                    <div className="message-container">
                      <span className={`message-text-${i}`}> {currentMessage[2]} </span>
                    </div>
                  </div>
                  <div className="date-container">
                    <span className={`date-text-${i}`}> {currentMessage[3].substring(currentMessage[3].length - 4, currentMessage[3].length - 12)} </span>
                  </div>
                </div>
              </li>
            })}
          </ul>
          <div className="input-container">
            <div id="send-username-container">
              <input name="send-username" placeholder="Type in a username" minLength="2" maxLength="20" value={this.state.username} onChange={this.handleUsernameChange}></input>
            </div>
            <div id="send-message-container">
              <input name="send-message" placeholder="Type in a message" minLength="2" maxLength="90" value={this.state.message} onChange={this.handleMessageChange}></input>
            </div>
            <a onClick={this.handleSubmit} id="submit-button">Submit</a>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
