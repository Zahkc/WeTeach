import React, { Fragment } from 'react';

import axios from 'axios';
import {Link} from 'react-router-dom';
import moment from 'moment-timezone';
import {db_api_ip} from '../components/janus/settings'

export default class Home extends React.Component {
	state = {
		media: []
	}
	componentDidMount() {
		document.title = "WeTeach - All Streams"
		axios.get(db_api_ip+`/api/v1/media`).then(res => {
		const media = res.data;
		this.setState({media: media});
		});
	}

	render()
	{

		return(
			<Fragment>
			<div id="content-all">
			<div className="col-md-12">
									<div className="main-title">
									<h3><span className="title">All Streams</span></h3>
									</div>
			</div><br />
			<div id="web-list">
			<div className="video-block section-padding">
							<div className="row">
							{
								this.state.media.map((media,k) => <div className="col-xl-3 col-sm-6 mb-3" key={k}>
											<div className="video-card">
											<div className="video-card-image">
												<Link to={`/media/${media._id}`} className="play-icon"><i className="fas fa-play-circle"></i></Link>
												<Link to={`/media/${media._id}`}>&nbsp;&nbsp;<i className="fas fa-fw fas fas fa-video"></i><br /><br /><br /><br /></Link>
												<div className={`live${media.liveStatus}`}></div>
											</div>
											<div className="video-card-body">
												<div className="video-title">
												<Link to={`/media/${media._id}`} href="#">{media.name}</Link>
												</div>
												<div className="video-description">{media.description}</div>
												<div className="video-view">
													<i className="fas fa-calendar-alt"></i>&nbsp;&nbsp;{moment(media.startDateTime).tz("Australia/Sydney").format('MMMM DD, yyyy H:mm')}
												</div>
											</div>
											</div>
										</div>
								)
							}


							</div>
						</div>
			</div></div>
			</Fragment>
	);

	}
}
