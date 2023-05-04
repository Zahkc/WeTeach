import React, { Fragment } from 'react';
import {useState, useEffect, useRef} from 'react';

import { Link, useParams, useNavigate } from 'react-router-dom';

import '../css/weteach-main.css';
import '../css/weteach-golive.css';

import axios from 'axios';

import {Spinner} from 'spin.js';
import {dbdaemon} from '../components/janus/settings'

function Viewer(props) {
	  const [media, setMedia] = useState({});

	  const { id } = useParams();
	  const navigate = useNavigate();

	  useEffect(() => {
		axios
		  .get(`${dbdaemon}/api/v1/media/${id}`)
		  .then((res) => {
			setMedia(res.data);
		  })
		  .catch((e) => {
			console.log(e);
		  });
	  }, [id]);

  return (
   <Fragment>
      <div id="content-all">
			<div className="col-md-3">
									<div className="main-title">
									<h3><span className="title">View Stream</span></h3>
									</div>

			</div><br />

           <div id="content-wrapper">
              <div className="container-fluid pb-0">
                <div className="video-block section-padding">
                  <div className="row">
                      <div className="col-md-5">
						<div className="single-video-left">
						<div className="single-video" style = {{verticalAlign:"unset"}}>

						<video
							width="100%"
							frameBorder="0"
							volume="0"
							className="App-video"
							id="local_vid"
							allowFullScreen="1"
							autoPlay
							src={require("/weteach/data/${media.src[0].href}")}}
              controls
              poster={thumbnail}
              onPause={handlePause}
              onPlay={handlePlay}
              ></video>
							
						</div>


						</div></div>
					
						 <div className="single-video-info-content box mb-3">
                                          <p>{/*Stream Date & Time*/}</p>
                                          <h6>About:</h6>
                                          <p>Test your input devices before streaming
                                          </p>
                                          <h6>Disciplines:</h6>
                                          <p className="tags mb-0">
                                             <span><a href="#v">IT</a></span>&nbsp;&nbsp;
                                             <span><a href="#v">Computing</a></span>&nbsp;&nbsp;
                                          </p><br />
						 </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
    </Fragment>
  );
}

export default Viewer;