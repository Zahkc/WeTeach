import React, { Fragment } from 'react';
import Header from './header'
import {NavLink, Link} from 'react-router-dom';

class WatchStream extends React.Component{
    render(){
        return(
         <Fragment>
            <div id="page-wrapper">			
				<Header/>  				
							
			<div id="content-all">	
                                       
                  <div id="content-wrapper">
                    <div className="container-fluid pt-5 pb-5">
                      <iframe src="/WatchLive" width="100%" height="1300"></iframe>
                    </div>
                    </div>
            </div></div>
        </Fragment>
        );
    }
}

export default WatchStream;
