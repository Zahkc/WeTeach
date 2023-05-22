import React, { Fragment } from 'react';
import {useState, useEffect, useRef} from 'react';

import { Link, useParams, useNavigate } from 'react-router-dom';

import '../css/weteach-main.css';
import '../css/weteach-golive.css';

import axios from 'axios';

import {Spinner} from 'spin.js';
import {mediaserver} from '../components/janus/settings'
import {dbdaemon} from '../components/janus/settings'
import moment from 'moment-timezone';

function Viewer(props) {
 document.title = "WeTeach - Video Player";
	  const [media, setMedia] = useState({
		id: "",
		name: "",
		description: "",
		liveStatus: -1,
		startDateTime: "",
		sponsor: "",
		disciplines: [],
		videoConferenceId: 0,
		user: 1,
		author: "",
		disciplines: [],
		src: [],

	  });
	  var thumbnail = process.env.PUBLIC_URL + "/img/thumbs.png";
	  const { id } = useParams();

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
			src: res.data.src,
			user: localStorage.getItem("user"),
			author: res.data.createdByName,
			sponsor: res.data.sponsoredByName
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
              ></video><br />
						</div>


						</div></div>
						 <div className="main-title"><br />
									<h3><span className="title">{media.name}</span></h3>

									<div style={{"position":"relative","left":"0px","width":"fit-content"}} className="live2"></div><br />
						 <p className="tags mb-0">
                                          {media.disciplines.map((tag, k) => <Fragment><span><a href="#v" key={k}>{tag}</a></span>&nbsp;&nbsp;</Fragment>)}
                                          </p><br />
						 </div>
						 <div className="single-video-info-content box mb-3">
						 <h6>Stream Details:</h6>
						  <p className="video-metadata"><span className="video-metadata-key"><i className="far fa-comment-dots	"></i>&nbsp;&nbsp;Description:</span><span>&nbsp;&nbsp;{media.description}</span><br /></p>										   
						  <p className="video-metadata"><span className="video-metadata-key"><i className="fas fa-chalkboard-teacher"></i>&nbsp;&nbsp;Presenter:</span><span>&nbsp;&nbsp;{media.author}</span><br /></p>										  
						  <p className="video-metadata"><span className="video-metadata-key"><i className="fas fa-book-reader"></i>&nbsp;&nbsp;Content Creators:</span>&nbsp;&nbsp;{media.sponsor}</p>
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
