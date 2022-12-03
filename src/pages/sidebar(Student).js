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
            </ul>
        </Fragment>
    )
}

export default SideBar;