import React, { Fragment } from "react";

export default class App extends React.Component {
    constructor() {
      super();
      this.state = {
        flag: 0
      };
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick() {
      this.setState({
        flag: this.state.flag === 0 ? 1 : 0
      });
    }
    render() {
      return (
        <div>
          <button
            className={this.state.flag === 1 ? "selected" : "button-plus"}
            onClick={this.handleClick}
          >
            {this.state.flag === 1 ? <span>Chat Room</span> : <span>Chat Room</span>}
          </button>
          {this.state.flag === 1 && (
                <div className="containerChat">
                <p>
                    <a className="container img">
                    <img alt="Avatar" src="assets/img/icon1.png" style={{width: '10%'}} />
                    </a></p><p className="chat"><a className="container img">Hello. Good Video</a></p><a className="container img">
                    <span className="time-right">11:00</span>
                    <img alt="Avatar" src="assets/img/icon2.png" style={{width: '10%'}} />
                    <p className="chat">Hello. Keep it up</p>
                    <span className="time-right">11:05</span>
                    </a>
                <p />
                </div>
          )}
        </div>
      );
    }
  }
  