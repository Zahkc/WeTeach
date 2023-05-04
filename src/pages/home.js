import React, { Fragment } from 'react';

import axios from 'axios';
import {Link} from 'react-router-dom';
import moment from 'moment-timezone';
import {dbdaemon} from '../components/janus/settings'
import MediaItem from '../components/MediaItem';
export default class Home extends React.Component {
	state = {
		media: []
	}
	componentDidMount() {
		document.title = "WeTeach - All Streams"
		axios.get(`${dbdaemon}/api/v1/media`).then(res => {
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
				this.state.media.length === 0 ? "<br>No streams or videos have been created.</br>" : this.state.media.map((media,k) => <div className="col-xl-3 col-sm-6 mb-3"><MediaItem media={media} key={k} /></div>)
			}
			</div>
			</div>
			</div></div>
			</Fragment>
	);

	}
}
