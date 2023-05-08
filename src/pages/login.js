import React, { Fragment, useState } from 'react';
import axios from 'axios';
import {NavLink, Link} from 'react-router-dom';
import Logo from "../assets/img/logo.png"

import Select from 'react-select/creatable';
import {dbdaemon} from '../components/janus/settings';

function Login() {
		document.title = "Login into WeTeach"
		const [lsession, setLSession] = useState({
			username: '',
			name: '',
			password: '',	
			role: ''
		});

		const onChange = (e) => {
			setLSession({ ...lsession, [e.target.name]: e.target.value });
		};

		const onSubmit = (e) => {
			e.preventDefault();
			
			switch(lsession.role)
			{
				case 0:
				axios.post(`${dbdaemon}/auth/login/presenter`,lsession).then((res)=>
				{
					console.log(res.data);
					setLSession({password: ""});
				}).catch((e) => console.log(e));
				break;
				case 2:
				axios.post(`${dbdaemon}/auth/login/attendee`,lsession).then((res)=>
				{
					console.log(res.data);
					setLSession({password: ""});
				}).catch((e) => console.log(e));				
				break;
				default:
				axios.post(`${dbdaemon}/auth/login/`,lsession).then((res)=>
				{
					console.log(lsession);
					console.log(res.data);
					setLSession({password: ""});
					console.log(lsession);
				}).catch((e) => console.log(e));					
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
							 {value:6, label:"Guest / Anonymous Login"},
							 {value:0, label:"Presenter"},
							 {value:2, label:"Attendee"}]}
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
                        </form>
                    </div>
                    </div>
                </div>
            </section>
        </Fragment>
        );
}


export default Login;