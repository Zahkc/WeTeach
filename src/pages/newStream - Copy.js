import React, {useState, useEffect, Fragment} from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment-timezone';
import '../css/weteach-main.css';

import { Navigate } from "react-router-dom";

class NewStream extends React.Component{
	
	
	
	
	
	state = {
		thisChannel: '',		
		availableDisciplines: [],
		name: '',
		description: '',
		startDateTime: '',
		disciplines: '',
		redirecturl: ''		

	}
	componentDidMount() {
		document.title = "WeTeach - New Stream";
		axios.get(`http://localhost:5000/api/v1/channels/.default`).then(res => {
		const dataset = res.data;
		this.setState({thisChannel: dataset[0]._id});
		this.setState({availableDisciplines: dataset[0].disciplines});
		});
		this.setState({startDateTime: moment().utc().format("YYYY-MM-DD[T]hh:mm:00[Z]")});
	}
	
	
    render(){

		const onChange = (e) => {	
			this.setState({[e.target.name]: e.target.value });			
		};

		const onSubmit = (e) => {
			console.log(this.state);			
			axios.post(`http://localhost:5000/api/v1/media`,this.state).then((res)=>
			{	
				let mediaID = res.data.insertedId;			
				let channelID = this.state.thisChannel;								
				let disciplines = this.state.disciplines;
				/* Index this object in the current channel */
				axios.post(`http://localhost:5000/api/v1/channels/${channelID}/media`,JSON.stringify({"media": mediaID}), {headers: {'Content-Type': 'application/json'}}).then((r)=>
				{									
					//console.log(r.data);
				}).catch((e) => console.log(e));
				
				/* Update available disciplines to include any new entries */
				axios.post(`http://localhost:5000/api/v1/channels/${channelID}/disciplines`,JSON.stringify({"discipline": disciplines}), {headers: {'Content-Type': 'application/json'}}).then((r)=>
				{	
					//console.log(r.data);
				}).catch((e) => console.log(e));;			

				/* Update disciplines object on media object */
				axios.post(`http://localhost:5000/api/v1/media/${mediaID}/disciplines`,JSON.stringify({"discipline": disciplines}), {headers: {'Content-Type': 'application/json'}}).then((r)=>
				{					
					//console.log(r.data);
				}).catch((e) => console.log(e));;			
							
				if(this.state.redirecturl == "go-live")
				{					
					console.log("1")
					return <Navigate to="/media/{$MediaID}/present" replace={true} />;
				}
				else
				{
					console.log("2")
					return <Navigate to="/" replace={true} />;
				}
				
				
			}).catch((e) => console.log(e));;
			
			
	
			
		};	
		
		
        return(
         <Fragment>
								
			<div id="content-all">		    
			<div className="col-md-12">
									<div className="main-title">
									<h3><span className="title">New Stream</span></h3>
									</div>
			</div><br />			
                  <div id="content-wrapper">
                    <div className="container-fluid upload-details">  
						<form onSubmit={onSubmit}>
                        <div className="row">
                        <div className="col-lg-12">
                            <div className="osahan-form">
                            <div className="row">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">
                                    <label htmlFor="name">Stream Title</label>
                                    <input
                                    type="text"
                                    placeholder="Enter title for stream here"
                                    id="e1"
									name="name"
                                    className="form-control" required="1"
									autoComplete="off"
									onChange={onChange}
                                    />
                                </div>
                                </div>
								</div><div className="row">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <input
                                    type="text"
                                    placeholder="Enter description for stream here"
                                    id="e2"
									name="description"
                                    className="form-control" required="1"
									autoComplete="off"
									onChange={onChange}
                                    />
                                </div>
                                </div>   
								</div><div className="row">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">
								<label htmlFor="e3">Disciplines</label>
								<CreatableSelect 
									isMulti
									closeMenuOnSelect={false}									
									options={this.state.availableDisciplines.map(function(value) {var option = {"value": value, "label": value}; return option;})}								
									onChange={(v) => this.setState({disciplines: v.map((t,k)=>t.value)})} 
								/>								
                                </div>
                                </div>
								</div><div className="row">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">								
								<label htmlFor="e3">Stream Start Date (optional)</label><br />
								<DateTimePicker 
									ampm={false}
									disablePast
									defaultValue={moment().add(1, "minute")}
									minDateTime={moment().add(-1, "seconds")} 									
									name="startDateTime"
									onChange={(v) => {this.setState({startDateTime: moment(v._d).utc().format("YYYY-MM-DD[T]hh:mm:00[Z]")})}}
									/>
								</div>
                                </div>
								</div><div className="row">
								<div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">
								<div className="osahan-area text-center mt-3">
								<button type="submit" className="btn btn-go-live" id="go-live" onClick={(e)=>{this.setState({redirecturl: "go-live"})}}
								formTarget="_self">Go Live</button>&nbsp;&nbsp;						
								<button type="submit" className="btn btn-primary" id="schedule" onClick={(e)=>{this.setState({redirecturl: "home"})}}
								formTarget="_self">Schedule Stream</button>&nbsp;&nbsp;
								<button type="reset" className="btn btn-secondary">Reset Form</button>
								</div>
								</div>
								</div>
								
                            </div>
                            </div>
                        </div>
                        </div>
							</form>
													
                    </div>
                    </div>
                

            </div>
        </Fragment>
        );	
    }
}

export default NewStream;