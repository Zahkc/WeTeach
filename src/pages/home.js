import React, { Fragment } from 'react';
import Header from './header'
import {NavLink, Link} from 'react-router-dom';

class Home extends React.Component{
    render(){
        return(
            <Fragment>
                <body>			
				<div id="page-wrapper">			
                    <Header/>  				
				</div>				
				<div id="content-all">		
				<div className="col-md-12">
                                        <div className="main-title">
                                        <h3><span className="title">All Streams</span></h3>
                                        </div>
				</div><br />
				<div id="web-list">
				<div className="video-block section-padding">
                                <div className="row">
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#">&nbsp;&nbsp;<i className="fas fa-fw fas fas fa-video"></i><br /><br /><br /><br /></a>
                                            <div className="live2"></div>
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
                                    </div> 
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#">&nbsp;&nbsp;<i className="fas fa-fw fas fas fa-video"></i><br /><br /><br /><br /></a>
                                            <div className="live2"></div>
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
                                    </div>
									 <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#">&nbsp;&nbsp;<i className="fas fa-fw fas fas fa-video"></i><br /><br /><br /><br /></a>
                                            <div className="live2"></div>
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
                                    </div>
                                </div>
                            </div>
				</div></div>			
				</body>
				
				
            </Fragment>
        )
    }
}


export default Home;
