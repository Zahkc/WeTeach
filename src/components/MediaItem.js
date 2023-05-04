import React from 'react';
import { Link } from 'react-router-dom';
import '../css/weteach-main.css';



const MediaItem = (props) =>
return (

	<div className="video-card">
	<div className="video-card-image">
	<Link to={`/media/${media._id}`} className="play-icon"><i className="fas fa-play-circle"></i></Link>
	<Link to={`/media/${media._id}`}>&nbsp;&nbsp;<i className="fas fa-fw fas fas fa-video"></i><br /><br /><br /><br /></Link>
	<div className={`live${media.liveStatus}`}></div>
	</div>
		<div className="video-card-body">
			<div className="video-title">
			<Link to={`/media/${media._id}/${media.liveStatus}`}>{media.name}</Link>
			</div>
			<div className="video-description">{media.description}</div>
			<div className="video-view">
				<i className="fas fa-calendar-alt"></i>&nbsp;&nbsp;{moment(media.startDateTime).tz("Australia/Sydney").format('MMMM DD, yyyy H:mm')}&nbsp;&nbsp;
			{
			  (media.locked === 0 && media.purged === 0 && (media.liveStatus === 0 || media.liveStatus === 3) {
				<Fragment>
				<Link to={`/media/${media._id}/edit`} >Edit Stream</Link>&nbsp;&nbsp;
				</Fragment>
			}
			{ (media.locked === 0 && media.purged === 0 && media.liveStatus === 2) ?
				<Fragment>
				<Link to={`/media/${media._id}/edit`} >Edit Video</Link>&nbsp;&nbsp;
				</Fragment> : null
			}

			{
			(media.locked === 0 && media.purged === 0 && media.liveStatus === 0) ?
				<Fragment>
				<Link to={`/media/${media._id}/present`} >Go-Live</Link>&nbsp;&nbsp;
				</Fragment> : null
			}
			</div>
		</div>
		</div>
);

}

export default MediaItem;
