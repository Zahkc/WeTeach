import React, { Fragment } from 'react';
import NavBar from './navBar'
import SideBarTeacher from './sidebar(Teacher)'
import {NavLink, Link} from 'react-router-dom';

class Upload extends React.Component{
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
                            <h4 className="mt-5">Select Video files to upload</h4>
                            <p className="land">or drag and drop video files</p>
                            <div className="mt-4">
                            <NavLink className="btn btn-outline-primary" to ="/uploadVideo">
                                Upload Video
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

export default Upload;