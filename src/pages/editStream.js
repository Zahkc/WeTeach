import React, { Fragment,Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment-timezone';
import '../css/weteach-main.css';
import { useParams } from "react-router-dom";
import {dbdaemon} from '../components/janus/settings';

class EditStream extends React.Component{

	state = {
		thisChannel: '',
		thisMedia: '',
		availableDisciplines: [],
		name: '',
		description: '',
		startDateTime: '',
		disciplines: [],
		liveStatus: 0,
		formEnabled: true
	}
	componentDidMount() {
		document.title = "WeTeach - Edit Stream";
		const mediaID = this.props.params.id
		this.setState({thisMedia: mediaID});

		axios.get(`${dbdaemon}/api/v1/channels/.default`).then(res => {
		const dataset = res.data;
		this.setState({thisChannel: dataset[0]._id});
		this.setState({availableDisciplines: dataset[0].disciplines});
		});

		axios.get(`${dbdaemon}/api/v1/media/${mediaID}`).then(res => {
		const mdataset = res.data;
		this.setState({name: mdataset.name});
		this.setState({description: mdataset.description});

		this.setState({startDateTime: mdataset.startDateTime});
		this.setState({disciplines: mdataset.disciplines});
		this.setState({liveStatus: mdataset.liveStatus});

		if(mdataset.locked === 1 || mdataset.purged === 1 || mdataset.liveStatus === 1 || mdataset.liveStatus === 4)
		{
			this.setState({formEnabled: false})
		}
		if(mdataset.liveStatus === 2)
		{
			document.title = "WeTeach - Edit Video";
		}
		document.getElementById("output-success").style.display='none';
		document.getElementById("output-failure").style.display='none';
		}).catch((e) => console.log(e));
	}


    render(){
		console.log(this.state);
		const onChange = (e) => {
			this.setState({[e.target.name]: e.target.value });
		};

		const onDelete = (e) => {
			e.preventDefault();
			let mediaID = this.state.thisMedia;
			axios.delete(`${dbdaemon}/api/v1/media/${mediaID}`,this.state).then((res)=>
			{

				this.setState({thisMedia: mediaID});
				let channelID = this.state.thisChannel;
				let disciplines = this.state.disciplines;

				/* Un-Index this object in the current channel */
				axios.delete(`${dbdaemon}/api/v1/channels/${channelID}/media`,JSON.stringify({"media": mediaID}), {headers: {'Content-Type': 'application/json'}}).then((r)=>
				{
					//console.log(r.data);
				}).catch((e) => console.log(e));

				document.getElementById("output-success").style.display='inline-block';
				document.getElementById("output-failure").style.display='none';

			}).catch((e) => {console.log(e)
			document.getElementById("output-success").style.display='none';
			document.getElementById("output-failure").style.display='inline-block';
			});

		}

		const onSubmit = (e) => {
			e.preventDefault();
			let mediaID = this.state.thisMedia;
			axios.post(`${dbdaemon}/api/v1/media/${mediaID}`,this.state).then((res)=>
			{

				this.setState({thisMedia: mediaID});
				let channelID = this.state.thisChannel;
				let disciplines = this.state.disciplines;

				/* Index this object in the current channel */
				axios.post(`${dbdaemon}/api/v1/channels/${channelID}/media`,JSON.stringify({"media": mediaID}), {headers: {'Content-Type': 'application/json'}}).then((r)=>
				{
					//console.log(r.data);
				}).catch((e) => console.log(e));

				/* Update available disciplines to include any new entries */
				axios.post(`${dbdaemon}/api/v1/channels/${channelID}/disciplines`,JSON.stringify({"discipline": disciplines}), {headers: {'Content-Type': 'application/json'}}).then((r)=>
				{
					//console.log(r.data);
				}).catch((e) => console.log(e));

				/* Update disciplines object on media object */
				axios.post(`${dbdaemon}/api/v1/media/${mediaID}/disciplines/replace`,JSON.stringify({"discipline": disciplines}), {headers: {'Content-Type': 'application/json'}}).then((r)=>
				{
					//console.log(r.data);
				}).catch((e) => console.log(e));

				document.getElementById("output-success").style.display='inline-block';
				document.getElementById("output-failure").style.display='none';

			}).catch((e) => {console.log(e)
			document.getElementById("output-success").style.display='none';
			document.getElementById("output-failure").style.display='inline-block';
			});

		};

        return(
         <Fragment>

			<div id="content-all">
			<div className="col-md-12">
									<div className="main-title">
									{
									(this.state.liveStatus == 2) ?
									<Fragment>
									<h3><span className="title" id="editabletitle">Edit Video</span></h3>
									</Fragment> :<Fragment>
									<h3><span className="title" id="editabletitle">Edit Stream</span></h3>
									</Fragment>
									}
									</div>
									<div style={{"position":"relative","left":"0px","width":"fit-content"}} className={`live${this.state.liveStatus}`}></div>
			</div><br />
                  <div id="content-wrapper">
                    <div className="container-fluid upload-details">
						<form onSubmit={onSubmit} id="editor">
                        <div className="row">
                        <div className="col-lg-12">
                            <div className="restyled-form">
                            <div className="row">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">
                                    <label htmlFor="name">Stream Title</label>
								{
									this.state.formEnabled ?
								<Fragment>
									<input
                                    type="text" name="name"
									defaultValue={this.state.name}
                                    placeholder={this.state.name}
                                    id="e1"
                                    className="form-control" required="1"
									autoComplete="off"
									onChange={onChange}
                                    />
								</Fragment> :
								<Fragment>
									<input
                                    type="text"
									value={this.state.name}
                                    id="e1"
                                    className="form-control" required="1"
									autoComplete="off"
									onChange={onChange}
									disabled
                                    />
								</Fragment>
								}
                                </div>
                                </div>
								</div><div className="row">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">

								<label htmlFor="description">Description</label>
								{
									this.state.formEnabled ?
								<Fragment>
								<input
                                    type="text" name="description"
                                    defaultValue={this.state.description}
									placeholder={this.state.description}

                                    id="e2"
                                    className="form-control" required="1"
									autoComplete="off"
									onChange={onChange}
                                    />
								</Fragment> :
								<Fragment>
								<input
                                    type="text"
                                    value={this.state.description}
                                    id="e2"
                                    className="form-control" required="1"
									autoComplete="off"
									onChange={onChange}
									disabled
                                    />
								</Fragment>
								}
                                </div>
                                </div>
								</div><div className="row">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">
								<label htmlFor="e3">Disciplines</label>
								{
									this.state.formEnabled ?
								<Fragment><CreatableSelect
									isMulti
									closeMenuOnSelect={false}
									value={this.state.disciplines.map(function(value) {var o = {"value": value, "label": value}; return o;})}
									options={this.state.availableDisciplines.map(function(value) {var option = {"value": value, "label": value}; return option;})}
									onChange={(v) => this.setState({disciplines: v.map((t,k)=>t.value)})} />
								</Fragment> :
								<Fragment><CreatableSelect
									isMulti
									closeMenuOnSelect={false}
									value={this.state.disciplines.map(function(value) {var o = {"value": value, "label": value}; return o;})}
									options={this.state.availableDisciplines.map(function(value) {var option = {"value": value, "label": value}; return option;})}
									onChange={(v) => this.setState({disciplines: v.map((t,k)=>t.value)})} isDisabled />
								</Fragment>

								}
                                </div>
                                </div>
								</div><div className="row">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">


								<label htmlFor="e3">Stream Start Date (optional)</label><br />
								{
									this.state.formEnabled ?
								<Fragment>
								<DateTimePicker
									ampm={false}
									value={moment(this.state.startDateTime).tz("Australia/Sydney")}
									minDateTime={moment(this.state.startDateTime).add(-1, "seconds")}
									name="startDateTime"
									onChange={(v) => {this.setState({startDateTime: moment(v._d).utc().format("YYYY-MM-DD[T]hh:mm:00[Z]")})}}
									/>
								</Fragment> :
								<Fragment>
								<DateTimePicker
									ampm={false}
									value={moment(this.state.startDateTime).tz("Australia/Sydney")}
									minDateTime={moment(this.state.startDateTime).add(-1, "seconds")}
									name="startDateTime"
									onChange={(v) => {this.setState({startDateTime: moment(v._d).utc().format("YYYY-MM-DD[T]hh:mm:00[Z]")})}}
									disabled
									/>
								</Fragment>
								}
								</div>
                                </div>
								</div>
								{
									this.state.formEnabled ?
								<Fragment>
								<div className="row" id="submit-buttons">
								<div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">
								<div className="restyled-area mt-3">
								{
									(this.state.liveStatus == 2) ?
									<Fragment>
								<button type="submit" className="btn btn-primary" formTarget="_self">Update Video</button>&nbsp;&nbsp;

								<button type="button" className="btn btn-primary" onClick={onDelete}>Delete Video</button>&nbsp;&nbsp;
								</Fragment> :
								<Fragment>
								<button type="submit" className="btn btn-primary" formTarget="_self">Update Stream</button>&nbsp;&nbsp;

								<button type="button" className="btn btn-primary" onClick={onDelete}>Cancel Stream</button>&nbsp;&nbsp;
								</Fragment>
								}

								<button type="reset" className="btn btn-secondary">Reset</button>
								</div>
								</div>
								</div></div>
								</Fragment> : null
								}

                            </div>
                        </div>
                        </div>

							</form>
					<div className="row">
								<div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">
						<div id="output-failure" style={{display:"none"}}>
								<div className="bg-failure">Stream failed to updated</div><br />
						</div>
						<div id="output-success" style={{display:"none"}}>
								<div className="bg-success">Stream successfully updated!</div><br />
						</div>
						</div>
								</div>
								</div>
                    </div>
                    </div>


            </div>
        </Fragment>
        );
    }
}

export default (props) => (
    <EditStream
        {...props}
        params={useParams()}
    />
);
