import React, { Fragment } from 'react';

import axios from 'axios';
import {Link} from 'react-router-dom';
import moment from 'moment-timezone';
import {dbdaemon} from '../components/janus/settings'
import MediaItem from '../components/MediaItem';
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
class Home extends React.Component {
        state = {
                media: [],
                search: "",
        }
        componentDidMount() {
                const search = this.props.params.search;
                if(!(typeof search === "undefined"))
                {
                        document.title = "WeTeach - Search Results for ${search}"
                        axios.get(`${dbdaemon}/api/v1/media/search?q=${search}`).then(res => {
                        const media = res.data;
                        this.setState({media: media});
                        });
                        this.setState({search: search});
                        console.log(search);
                }
                else
                {
                        document.title = "WeTeach - All Streams"
                        axios.get(`${dbdaemon}/api/v1/media`).then(res => {
                        const media = res.data;
                        this.setState({media: media});
                        });
                }

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
                        {/* Here load the MediaItem component using an array mapping */}
                        <div className="row">
                        {
                                this.state.media.length === 0 ? <Fragment><b>No streams or videos have been created. If this is not correct, please contact the system administrator as this means a backend API component is not functioning as expected</b></Fragment> : this.state.media.map((media,k) => <div className="col-xl-3 col-sm-6 mb-3"><MediaItem media={media} key={moment()+"-tile-"+k} /></div>)
                        }
                        </div>
                        </div>
                        </div></div>
                        </Fragment>
        );

        }
}


export default (props) => (
    <Home
        {...props}
        params={useParams()}
    />
);
