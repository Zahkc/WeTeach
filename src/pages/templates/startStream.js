import React, { Fragment } from 'react';
import NavBar from './navBar'
import SideBarTeacher from './sidebar(Teacher)'
import {NavLink, Link} from 'react-router-dom'
import GoLive from '../golive'

class StartStream extends React.Component{
    render(){
        return(
         <Fragment>
            <div>
               <NavBar/>
                  <div id="wrapper">
                     <SideBarTeacher/>
                  </div>
                  <div id="content-wrapper">
                    <div className="container-fluid pt-5 pb-5">

                    </div>
                    </div>
            </div>
        </Fragment>
        );
    }
}

export default StartStream;
