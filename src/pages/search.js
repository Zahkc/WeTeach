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
                if(!(typeof search === "undefined" || search === ""))
                {
                        document.title = `WeTeach - Search Results for ${search}`
                        axios.get(`${dbdaemon}/api/v1/media/search?q=${search}`).then(res => {
                        const media = res.data;
                        this.setState({media: media});
                        });
                        this.setState({search: search});
                        console.log(search);
                }
                else
                {
                        document.title = "WeTeach - Showing All Streams"
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
		<h3><span className="title">{(!(typeof this.state.search === "undefined" || this.state.search === "")) ? <Fragment>Search Results for {this.state.search} </Fragment>:<Fragment>Search Results for *</Fragment>}</span></h3>
                                                                        </div>
                        </div><br />
                        <div id="web-list">
                        <div className="video-block section-padding">
                        <div className="row">
                        {
                                this.state.media.length === 0 ? <Fragment><b>No results found.</b></Fragment> : this.state.media.map((media,k) => <div className="col-xl-3 col-sm-6 mb-3"><MediaItem media={media} key={k} /></div>)
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