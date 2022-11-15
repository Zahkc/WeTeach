import React, { Fragment } from 'react';
import {NavLink, Link} from 'react-router-dom';
import NavBar from './NavBar'

class Home extends React.Component{
    render(){
        return(
            <Fragment>
                <div>
                    <NavBar/>
                    <div id="wrapper">
                        {/*<!-- Sidebar -->*/}
                        <ul className="sidebar navbar-nav">
                            <li className="nav-item active">
                            <NavLink to = "/">
                            <i className="fas fa-fw fa-home"></i>
                            <span>Home</span>
                            </NavLink>
                            </li>

                            <li className="nav-item">
                            <NavLink to = "/videoPage">
                            <i className="fas fa-fw fa-users"></i>
                            <span>Video Page</span>
                            </NavLink>
                            </li>
                        </ul>
                        <div id="content-wrapper">
                            <div className="container-fluid pb-0">
                            <div className="top-mobile-search">
                                <div className="row">
                                    <div className="col-md-12">   
                                        <form className="mobile-search">
                                        <div className="input-group">
                                            <input type="text" placeholder="Search for..." className="form-control" />
                                            <div className="input-group-append">
                                                <button type="button" className="btn btn-dark"><i className="fas fa-search"></i></button>
                                            </div>
                                        </div>
                                        </form>   
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className="video-block section-padding">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="main-title">
                                        <h6>Enrolled Streams</h6>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#"><img className="img-fluid" src="assets/img/v1.png" alt="" /></a>
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
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#"><img className="img-fluid" src="assets/img/v2.png" alt="" /></a>
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
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#"><img className="img-fluid" src="assets/img/v3.png" alt="" /></a>
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
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#"><img className="img-fluid" src="assets/img/v4.png" alt="" /></a>
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
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#"><img className="img-fluid" src="assets/img/v5.png" alt="" /></a>
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
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
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
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#"><img className="img-fluid" src="assets/img/v7.png" alt="" /></a>
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
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#"><img className="img-fluid" src="assets/img/v8.png" alt="" /></a>
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
                                    </div>
                                </div>
                            </div>
                            <hr className="mt-0" />
                            <div className="video-block section-padding">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="main-title">
                                        <h6>Live channels we think you'll like</h6>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#"><img className="img-fluid" src="assets/img/v1.png" alt="" /></a>
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
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#"><img className="img-fluid" src="assets/img/v2.png" alt="" /></a>
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
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#"><img className="img-fluid" src="assets/img/v3.png" alt="" /></a>
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
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#"><img className="img-fluid" src="assets/img/v4.png" alt="" /></a>
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
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#"><img className="img-fluid" src="assets/img/v5.png" alt="" /></a>
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
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
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
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#"><img className="img-fluid" src="assets/img/v7.png" alt="" /></a>
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
                                    </div>
                                    <div className="col-xl-3 col-sm-6 mb-3">
                                        <div className="video-card">
                                        <div className="video-card-image">
                                            <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                            <a href="#"><img className="img-fluid" src="assets/img/v8.png" alt="" /></a>
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
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
            </Fragment>
        )
    }
}


export default Home;