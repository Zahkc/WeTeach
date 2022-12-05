import React, { Fragment } from 'react';
import NavBar from './navBar'
import SideBarTeacher from './sidebar(Teacher)'
import {NavLink, Link} from 'react-router-dom';

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
                        <div className="row">
                        <div className="col-md-8 mx-auto text-center upload-video pt-5 pb-5">
                            <h1>
                            <i className="fas fa-file-upload text-primary" />
                            </h1>
                            <h4 className="mt-5">Click 'Start Stream' to begin streaming</h4>
                            <p className="land">or connect an external streaming service</p>
                            <div className="mt-4">
                            <NavLink className="btn btn-outline-primary" to ="/uploadVideo">
                                Start Stream
                            </NavLink>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
            </div>
        </Fragment>
        );
    }
}

export default StartStream;