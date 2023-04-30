import React, { Fragment,Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment-timezone';
import '../css/weteach-main.css';

class VideoUpload extends React.Component{
	
	state = {
		thisChannel: '',
		thisMedia: '',		
		availableDisciplines: [],
		name: '',
		description: '',
		startDateTime: '',
		disciplines: [],		
		files: undefined,
		href: undefined,
		contentType: undefined,
		
	}
	componentDidMount() {
		document.title = "WeTeach - Upload Video";
		axios.get(`http://localhost:5000/api/v1/channels/.default`).then(res => {
		const dataset = res.data;
		this.setState({thisChannel: dataset[0]._id});
		this.setState({availableDisciplines: dataset[0].disciplines});
		});
		this.setState({startDateTime: moment().utc().format("YYYY-MM-DD[T]hh:mm:00[Z]")});
		document.getElementById("output-success").style.display='none';
		document.getElementById("output-failure").style.display='none';
	}
	
    render(){

		const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const files = Array.from(e.target.files)
		this.setState({files: files});
	  };
		const onChange = (e) => {	
			this.setState({[e.target.name]: e.target.value });			
		};

		const onSubmit = (e) => {
			e.preventDefault();
			var formData = new FormData();
			console.log(this.state.files);
			formData.append("files", this.state.files[0]);
			axios.post(`http://localhost:5002/upload`, formData, {headers: { "Content-Type": "multipart/form-data" }}).then((res) =>
			{
				let fileSubmission = res.data;
				this.setState({href: fileSubmission.href});
				this.setState({contentType: fileSubmission.contentType});

		
			axios.post(`http://localhost:5000/api/v1/media/upload`,this.state).then((res)=>
			{	
			
			let mediaID = res.data.insertedId;
				this.setState({thisMedia: mediaID});
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
							
			
			
				document.getElementById("output-success").style.display='inline-block';
				document.getElementById("output-failure").style.display='none';
				document.getElementById("submit-buttons").style.display='none';
			
				}
				).catch((e)=> {console.log(e)});				
				
			}).catch((e) => {console.log(e)
			
			document.getElementById("output-success").style.display='none';
			document.getElementById("output-failure").style.display='inline-block';
			document.getElementById("submit-buttons").style.display='none';
			});
			
			
	
			
		};	
		
		
        return(
         <Fragment>
								
			<div id="content-all">		    
			<div className="col-md-12">
									<div className="main-title">
									<h3><span className="title">Upload Video</span></h3>
									</div>
									<div style={{"position":"relative","left":"0px","width":"fit-content"}} className="live2"></div>
			</div><br />			
                  <div id="content-wrapper">
                    <div className="container-fluid upload-details">  
						<form onSubmit={onSubmit} id="editor">
                        <div className="row">
                        <div className="col-lg-12">
                            <div className="osahan-form">
                            <div className="row">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">
                                    <label htmlFor="name">Video Title</label>
                                    <input name="name"									
                                    type="text"
                                    placeholder="Enter title for stream here"
                                    id="e1"
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
                                    <input name="description"
                                    type="text"
                                    placeholder="Enter description for stream here"
                                    id="e2"								
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
								</div>
								<div className="row">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">
																
								<label htmlFor="e3">Video File</label><br />
								
								<input type="file" name="files" id="fileselector" accept=".mp4" onChange={handleFileSelected}/>
								</div>
                                </div>
								</div>
								
								
								
								<div className="row" id="submit-buttons">
								<div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">
								<div className="osahan-area mt-3">
								<button type="submit" className="btn btn-primary" formTarget="_self">Create Stream</button>&nbsp;&nbsp;													
								<button type="reset" className="btn btn-secondary">Reset</button>													
								</div>
								</div>
								</div>
								
                            </div>
                            </div>
                        </div>
                        </div>
							</form>
						<div className="row">
								<div className="col-xl-3 col-sm-6 mb-3">
                                <div className="form-group">
						<div id="output-failure" style={{display:"none"}}>
								<div className="bg-failure">Video failed to upload</div><br />
								<Link to="/upload/new" className="btn btn-primary">Retry</Link>&nbsp;&nbsp;						
								<Link to="/" className="btn btn-primary">Retry Later</Link>
						</div>
						<div id="output-success" style={{display:"none"}}>
								<div className="bg-success">Video successfully uploaded!</div><br />
						
								<Link to="/" className="btn btn-primary">View All Streams</Link>
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

export default VideoUpload;