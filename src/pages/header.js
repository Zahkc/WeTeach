import React, { Fragment } from "react";
import {NavLink, Link} from 'react-router-dom';

function Header() {
    return(
        <Fragment>
		{/* Desktop navigation bar */}			
			<div id="header-wrapper" className="fixed-top">
			<div id="header" className="navbar navbar-expand navbar-light bg-white osahan-nav">
			&nbsp;&nbsp;
                        <button className="smallscreen btn btn-link btn-sm text-secondary order-1 order-sm-0" id="sidebarToggle">
                        <i className="fas fa-bars"></i>
                        </button> &nbsp;&nbsp;
			<NavLink className="navbar-brand mr-1" to = "/"><img className="img-fluid" alt="" src="assets/img/logo.png" /></NavLink>
			{/*<!-- Navbar Search -->*/}
			<form className="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-5 my-2 my-md-0 osahan-navbar-search">
                            <div className="input-group">
                            <input type="text" className="form-control" placeholder="Search for..." />
                            <div className="input-group-append">
                                <button className="btn btn-light" type="button">
                                <i className="fas fa-search"></i>
                                </button>
                            </div>
                            </div>
                        </form>
			<ul className="navbar-nav ml-auto ml-md-0 osahan-right-navbar">                            
                            <li className="nav-item dropdown no-arrow osahan-right-navbar-user">
                            <a className="nav-link dropdown-toggle user-dropdown-link" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-user-alt"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                                <a className="dropdown-item" href="account.html"><i className="fas fa-fw fa-user-circle"></i> &nbsp; My Account</a>
                                <a className="dropdown-item" href="settings.html"><i className="fas fa-fw fa-cog"></i> &nbsp; Settings</a>
                                <div className="dropdown-divider"></div>
                                <NavLink to ="/login">
                                <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal"><i className="fas fa-fw fa-sign-out-alt"></i> &nbsp; Logout</a>
                                </NavLink>
                            </div>
                            </li>
                        </ul>				
			</div><div id="navigation" className="navbar navbar-expand navbar-light bg-white sticky-top osahan-nav">
			<ul className="navbar-nav">
			<li className="element">
			<NavLink to = "/">
                <i className="fas fa-fw fas fas fa-film"></i>
                &nbsp;&nbsp;<span>All Streams</span>
                </NavLink></li>
			<li className="element reducible"><NavLink to = "/videoPage">
                <i className="fas fa-fw fas fas fa-podcast"></i>
                &nbsp;&nbsp;<span>New Stream</span>
                </NavLink></li>
			<li className="element reducible"><NavLink to = "/videoPage">
                <i className="fas fa-fw fas fas fa-play-circle"></i>
                &nbsp;&nbsp;<span>Go Live</span>
                </NavLink></li>			
			<li className="element reducible"><NavLink to = "/videoPage">
                <i className="fas fa-fw fas fas fa-video"></i>
                &nbsp;&nbsp;<span>Watch Stream</span>
                </NavLink></li>
							
			<li className="element reducible"><NavLink to = "/videoPage">
                <i className="fas fa-fw fas fas fa-cloud-upload-alt"></i>
                &nbsp;&nbsp;<span>Upload Video</span>
                </NavLink></li>
			</ul>
			
                    
			</div></div><br /><br /><br />
			<div id="sidebar" className="smallscreen">
			{/*<!-- Sidebar -->*/}
			<ul className="sidebar navbar-nav">
                <li className="nav-item active">
                <NavLink to = "/">
                <i className="fas fa-fw fa-film"></i>
                &nbsp;&nbsp;<span>All Streams</span>
                </NavLink>
                </li>

                <li className="nav-item">
                <NavLink to = "/videoPage">
                <i className="fas fa-fw fa-podcast"></i>
                &nbsp;&nbsp;<span>New Stream</span>
                </NavLink>
                </li>

                <li className="nav-item">
                <NavLink to = "/GoLive">
                <i className="fas fa-fw fa-play-circle"></i>
                &nbsp;&nbsp;<span>Go Live</span>
                </NavLink>
                </li>

                <li className="nav-item">
                <NavLink to = "/WatchLive">
                <i className="fas fa-fw fa-video"></i>
                &nbsp;&nbsp;<span>Watch Stream</span>
                </NavLink>
                </li>

                <li className="nav-item">
                <NavLink to = "/upload">
                <i className="fas fa-fw fa-cloud-upload-alt"></i>
                &nbsp;&nbsp;<span>Upload Video</span>
                </NavLink>
                </li>

            </ul>
			</div>
			
			
			
		</Fragment>
    )
}

export default Header;
