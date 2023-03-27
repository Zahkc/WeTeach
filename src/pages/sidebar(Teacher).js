import React, { Fragment } from "react";
import {NavLink, Link} from 'react-router-dom';

function SideBar() {
    return(
        <Fragment>
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

                <li className="nav-item">
                <NavLink to = "/GoLive">
                <i className="fas fa-fw fa-video"></i>
                <span>Start Stream</span>
                </NavLink>
                </li>

                <li className="nav-item">
                <NavLink to = "/WatchLive">
                <i className="fas fa-fw fa-video"></i>
                <span>Watch Stream</span>
                </NavLink>
                </li>

                <li className="nav-item">
                <NavLink to = "/upload">
                <i className="fas fa-fw fa-cloud-upload-alt"></i>
                <span>Upload Video</span>
                </NavLink>
                </li>

            </ul>
        </Fragment>
    )
}

export default SideBar;
