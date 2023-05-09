import React, { Fragment } from 'react';

import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import '../css/weteach-main.css';

const MediaItem = (props) => {
const media = props.media;
return (

	<div className="video-card">
	<div className="video-card-image">
	<Link to={`/media/${media._id}`} className="play-icon"><i className="fas fa-play-circle"></i></Link>
	<Link to={`/media/${media._id}`}>&nbsp;&nbsp;<i className="fas fa-fw fas fas fa-video"></i><br /><br /><br /><br /></Link>
	<div className={`live${media.liveStatus}`}></div>
	</div>
		<div className="video-card-body">
			<div className="video-title">
			<Link to={`/media/${media._id}/view/${media.liveStatus}`}>{media.name}</Link>
			</div>
			<div className="video-description">{media.description}</div>
			<div className="video-view">
				<i className="fas fa-calendar-alt"></i>&nbsp;&nbsp;{moment(media.startDateTime).tz("Australia/Sydney").format('MMMM DD, yyyy H:mm')}&nbsp;&nbsp;
			{
				(localStorage.getItem("capability") === "PRESENTER" && media.locked === 0) ? <Fragment>
			{
			  (media.purged === 0 && (media.liveStatus === 0 || media.liveStatus === 3)) ?
				<Fragment>
				<Link to={`/media/${media._id}/edit`} >Edit Stream</Link>&nbsp;&nbsp;
				</Fragment> : null
			}
			{ (media.purged === 0 && media.liveStatus === 2) ?
				<Fragment>
				<Link to={`/media/${media._id}/edit`} >Edit Video</Link>&nbsp;&nbsp;
				</Fragment> : null
			} 

			{
			(media.purged === 0 && media.liveStatus === 0 && localStorage.getItem("user") === media.createdBy) ?
				<Fragment>
				<Link to={`/media/${media._id}/present`} >Go-Live</Link>&nbsp;&nbsp;
				</Fragment> : null
			}
			</Fragment> : <Fragment>
			
			{
			  (media.purged === 0 && (media.liveStatus === 0 || media.liveStatus === 3)) ?
				<Fragment>
				<Link to={`/media/${media._id}/details`} >View Stream Details</Link>&nbsp;&nbsp;
				</Fragment> : null
			}
			{ (media.purged === 0 && media.liveStatus === 2) ?
				<Fragment>
				<Link to={`/media/${media._id}/details`} >View Video Details</Link>&nbsp;&nbsp;
				</Fragment> : null
			} 
			</Fragment>
			
			}
			
			</div>
		</div>
		</div>
);

}

export default MediaItem;
