import React, { Fragment, useState } from 'react';
import axios from 'axios';
import {NavLink, Link} from 'react-router-dom';
import Logo from "../assets/img/logo.png"

import Select from 'react-select/creatable';
import {dbdaemon} from '../components/janus/settings';
import { useNavigate } from 'react-router-dom';

function Login() {
		document.title = "Login into WeTeach"
		const navigate = useNavigate();
		const [lsession, setLSession] = useState({
			username: '',
			name: '',
			password: '',	
			role: 0
		});

		const onChange = (e) => {
			setLSession({ ...lsession, [e.target.name]: e.target.value });
			document.getElementById("output-failure").style.display="none"
		};

		const onSubmit = (e) => {
			e.preventDefault();
			
			switch(lsession.role)
			{
				case 0:
				axios.post(`${dbdaemon}/auth/login/presenter`,lsession).then((res)=>
				{
					let session = res.data;
					setLSession({ ...lsession,password: ""});
					
					localStorage.clear();
					localStorage.setItem("user", session.wmid);
					localStorage.setItem("name", session.name);
					localStorage.setItem("token", session.token);					
					localStorage.setItem("capability", "PRESENTER");
					navigate("/");
				}).catch((e) => {document.getElementById("output-failure").style.display="inline-block"; console.log(e)});
				break;
				case 2:
				axios.post(`${dbdaemon}/auth/login/attendee`,lsession).then((res)=>
				{					
					let session = res.data;
					setLSession({ ...lsession,password: ""});					
					localStorage.clear();
					localStorage.setItem("user", session.wmid);
					localStorage.setItem("name", session.name);					
					localStorage.setItem("token", session.token);					
					localStorage.setItem("capability", "ATTENDEE");
					navigate("/");
				}).catch((e) => {document.getElementById("output-failure").style.display="inline-block"; console.log(e)});				
				break;
				default:
				axios.post(`${dbdaemon}/auth/login/`,lsession).then((res)=>
				{
					let session = res.data;
					setLSession({ ...lsession,password: ""});
					localStorage.clear();				
					localStorage.setItem("name", lsession.name);
					navigate("/");
				}).catch((e) => navigate("/"));					
				break;
			}
		};
	
		return(
         <Fragment>
            <section className="login-main-wrapper">
                <div className="container-fluid pl-0 pr-0">
                    <div className="col-md-12 p-5 bg-white full-height">
                    <div className="login-main-left">
                        <div className="text-center mb-5 login-main-left-header pt-4">
                        <img alt="" src={Logo} className="img-fluid" />
                        <h2 className="mt-3 mb-3">Login into WeTeach</h2>
                        <p>
                            Stream educational content and more...
                        </p>
                        </div>
                        <form onSubmit={onSubmit} id="loginform">
						 <div className="form-group">
						<label>Role</label>
						<Select name="role"
						className="basic-single"
						classNamePrefix="select"
						 options={
							 [
							 
							 {value:0, label:"Presenter"},
							 {value:2, label:"Attendee"},
							 {value:6, label:"Guest / Anonymous Login"}]}
						 defaultValue={{value:0, label:"Presenter"}}
						 onChange={(v) => setLSession({ ...lsession,role: v.value})}
						/>
						</div>
                        <div className="form-group">
                            {lsession.role === 6 ? <Fragment><label>Display Name</label>
                            <input name="name"							
                            type="text"
                            className="form-control"
                            placeholder="Enter display name"
							autoComplete="off"
							onChange={onChange}
                            /></Fragment>:<Fragment><label>Username</label>
                            <input name="username"							
                            type="text"
                            className="form-control"
                            placeholder="Enter username"
							autoComplete="off"						
							onChange={onChange}
                            /></Fragment>
							}
							
                        </div>
                        <div className="form-group">                            
							{lsession.role === 6 ? <Fragment><label>Password</label><input name="password"
                            type="password"
                            className="form-control"
                            placeholder="No password required"
							autoComplete="off"
							onChange={onChange} disabled
                            /></Fragment> : <Fragment>
							<label>Password</label>
                            <input name="password"
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
							autoComplete="off"
							onChange={onChange}
                            /></Fragment>
							}
                        </div>
                        <div className="mt-4">
                            <div className="row">
                            <div className="col-12">
                                <button
                                type="submit"
                                className="btn btn-primary btn-block btn-lg"
                                >
                                Sign In
                                </button>
                            </div>
                            </div>

						</div>
						<div id="output-failure" style={{display:"none",color:"#ff253a"}} className="mt-4">
								<div className="bg-failure">Login failed for user {lsession.username}</div><br />								
						</div>
						
                        </form>
                    </div>
                    </div>
                </div>
            </section>
        </Fragment>
        );
}


export default Login;