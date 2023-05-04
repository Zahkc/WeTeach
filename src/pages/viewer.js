import React, { Fragment } from 'react';
import {useState, useEffect, useRef} from 'react';

import { Link, useParams, useNavigate } from 'react-router-dom';

import '../css/weteach-main.css';
import '../css/weteach-golive.css';

import axios from 'axios';

import {Spinner} from 'spin.js';
import {mediaserver} from '../components/janus/settings'
import {dbdaemon} from '../components/janus/settings'

function Viewer(props) {
	  const [media, setMedia] = useState({
		id: "",
		name: "",
		description: "",
		liveStatus: -1,
		disciplines: [],
		src: [],

	  });
	  var thumbnail = "https://i.imgur.com/MEAv9zb.png";
	  const { id } = useParams();
	  const navigate = useNavigate();

	  useEffect(() => {
		axios
		  .get(`${dbdaemon}/api/v1/media/${id}`)
		  .then((res) => {
			setMedia({
			id: res.data._id,
			name: res.data.name,
			description: res.data.description,
			liveStatus: res.data.liveStatus,
			disciplines: res.data.disciplines,
			src: res.data.src
			});
		  })
		  .catch((e) => {
			console.log(e);
		  });
	  }, [id]);

  return (
   media.liveStatus === 2 ?
   <Fragment>
      <div id="content-all">
			<div className="col-md-12">
									<div className="main-title">
									<h3><span className="title">{media.name}</span></h3>
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
							src={`${mediaserver}/media_content/${media.src[0].href}`}
              controls
              poster={thumbnail}
              ></video>
						</div>


						</div></div>

						 <div className="single-video-info-content box mb-3">
                                          <p>{/*Stream Date & Time*/}</p>
                                          <h6>About:</h6>
                                          <p>{media.description}
                                          </p>
                                          <h6>Disciplines:</h6>
                                          <p className="tags mb-0">
						{media.disciplines.map((tag, k) => <Fragment><span><a href="#v" key={k}>{tag}</a></span>&nbsp;&nbsp;</Fragment>)}
                                          </p><br />
						 </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
    </Fragment> : <Fragment><b>This content is not supported</b></Fragment>
  );
}

export default Viewer;
