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
            {this.state.flag === 1 ? <span>Up Next</span> : <span>Up Next</span>}
          </button>
          {this.state.flag === 1 && (
            <div className="col-md-12">
                                             <div className="video-card video-card-list">
                                                <div className="video-card-image">
                                                   <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                                   <a href="#"><img className="img-fluid" src="assets/img/v1.png" alt="" /></a>
                                                   <div className="time">3:50</div>
                                                </div>
                                                <div className="video-card-body">
                                                   <div className="video-title">
                                                      <a href="#">Here are many variati of passages of Lorem</a>
                                                   </div>
                                                
                                                   <div className="video-view">
                                                      1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                                                   </div>
                                                </div>
                                             </div>
                                             <div className="video-card video-card-list">
                                                <div className="video-card-image">
                                                   <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                                   <a href="#"><img className="img-fluid" src="assets/img/v2.png" alt="" /></a>
                                                   <div className="time">3:50</div>
                                                </div>
                                                <div className="video-card-body">
                                                   <div className="video-title">
                                                      <a href="#">Duis aute irure dolor in reprehenderit in.</a>
                                                   </div>
                                                
                                                   <div className="video-view">
                                                      1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                                                   </div>
                                                </div>
                                             </div>
                                             <div className="video-card video-card-list">
                                                <div className="video-card-image">
                                                   <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                                   <a href="#"><img className="img-fluid" src="assets/img/v3.png" alt="" /></a>
                                                   <div className="time">3:50</div>
                                                </div>
                                                <div className="video-card-body">
                                                   <div className="video-title">
                                                      <a href="#">Culpa qui officia deserunt mollit anim</a>
                                                   </div>
                                                
                                                   <div className="video-view">
                                                      1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                                                   </div>
                                                </div>
                                             </div>
                                             <div className="video-card video-card-list">
                                                <div className="video-card-image">
                                                   <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                                   <a href="#"><img className="img-fluid" src="assets/img/v4.png" alt="" /></a>
                                                   <div className="time">3:50</div>
                                                </div>
                                                <div className="video-card-body">
                                                   <div className="video-title">
                                                      <a href="#">Deserunt mollit anim id est laborum.</a>
                                                   </div>
                                                
                                                   <div className="video-view">
                                                      1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                                                   </div>
                                                </div>
                                             </div>
                                             <div className="video-card video-card-list">
                                                <div className="video-card-image">
                                                   <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                                   <a href="#"><img className="img-fluid" src="assets/img/v5.png" alt="" /></a>
                                                   <div className="time">3:50</div>
                                                </div>
                                                <div className="video-card-body">
                                                   <div className="video-title">
                                                      <a href="#">Exercitation ullamco laboris nisi ut.</a>
                                                   </div>
                                                
                                                   <div className="video-view">
                                                      1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                                                   </div>
                                                </div>
                                             </div>
                                             <div className="video-card video-card-list">
                                                <div className="video-card-image">
                                                   <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                                   <a href="#"><img className="img-fluid" src="assets/img/v6.png" alt="" /></a>
                                                   <div className="time">3:50</div>
                                                </div>
                                                <div className="video-card-body">
                                                   <div className="video-title">
                                                      <a href="#">There are many variations of passages of Lorem</a>
                                                   </div>
                                                
                                                   <div className="video-view">
                                                      1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                                                   </div>
                                                </div>
                                             </div>
                                          
                                             <div className="video-card video-card-list">
                                                <div className="video-card-image">
                                                   <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                                   <a href="#"><img className="img-fluid" src="assets/img/v2.png" alt="" /></a>
                                                   <div className="time">3:50</div>
                                                </div>
                                                <div className="video-card-body">
                                                   <div className="video-title">
                                                      <a href="#">Duis aute irure dolor in reprehenderit in.</a>
                                                   </div>
                                                
                                                   <div className="video-view">
                                                      1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
          )}
        </div>
      );
    }
  }
  