import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      receivedMessages: [],
      username: '',
      message: ''
    };
    this.handleUsernameChange=this.handleUsernameChange.bind(this);
    this.handleMessageChange=this.handleMessageChange.bind(this);
  }

  componentDidMount() {
    this.loadMessages();
  }

  loadMessages() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:5000/chat');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.setState({
          receivedMessages: JSON.parse(xhr.responseText)
        })
      }
    };
    xhr.send();
  }

  sendMessages() {

  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handleMessageChange(event) {
    this.setState({ message: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <ul class="chat-window">
            {this.state.receivedMessages.map((currentMessage, i) => {
              return <li key={currentMessage[0]}>
                <div class="chat-data">
                  <div class="username-container">
                    <span> {currentMessage[1]} </span>
                  </div>
                  <div class="message-container">
                    <span class="message-text"> {currentMessage[2]} </span>
                  </div>
                  <div class="date-container">
                    <span> {currentMessage[3].substring(currentMessage[3].length - 4, currentMessage[3].length - 12)} </span>
                  </div>
                </div>
              </li>
            })
            }
          </ul>
          <div class="input-container">
            <div id="send-username-container">
              <input name="send-username" placeholder="Type in a username" minLength="2" maxLength="45" value={this.state.username} onChange={this.handleUsernameChange}></input>
            </div>
            <div id="send-message-container">
              <input name="send-message" placeholder="Type in a message" minLength="2" maxLength="45" value={this.state.message} onChange={this.handleMessageChange}></input>
            </div>
            <a id="submit-button">Submit</a>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
