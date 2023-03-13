import React, { Fragment } from 'react';
import NavBar from './navBar'
import SideBarTeacher from './sidebar(Teacher)'
import {NavLink, Link} from 'react-router-dom';

// <iframe src="http://localhost:3000/GoLive" width="100%" height="1300"></iframe>

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
                      <iframe src="https://weteach.ddns.net/GoLive" width="100%" height="1300"></iframe>
                    </div>
                    </div>
            </div>
        </Fragment>
        );
    }
}

export default StartStream;
