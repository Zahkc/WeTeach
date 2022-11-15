import React, { Fragment } from 'react';
import {NavLink, Link} from 'react-router-dom';
import NavBar from './NavBar'

class VideoPage extends React.Component{
    render(){
        return(
         <Fragment>
            <div>
               <NavBar/>
                  <div id="wrapper">
                     <ul className="sidebar navbar-nav">
                     <li className="nav-item active">
                        <NavLink to = "/">
                        <i className="fas fa-fw fa-home"></i>
                        <span>Home</span>
                        </NavLink>
                        </li>

                        <li className="nav-item">
                        <NavLink to = "/videoPage">
                        <i className="fas fa-fw fa-users"></i>
                        <span>Video Page</span>
                        </NavLink>
                        </li>
                     </ul>
                     <div id="content-wrapper">
                        <div className="container-fluid pb-0">
                           <div className="video-block section-padding">
                              <div className="row">
                                 <div className="col-md-8">
                                    <div className="single-video-left">
                                       <div className="single-video">
                                          <iframe width="100%" height="315" src="https://www.youtube.com/embed/O5nskjZ_GoI?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                                       </div>
                                       <div className="single-video-title box mb-3">
                                          <h2><a href="#">Early Computing: Crash Course Computer Science #1</a></h2>
                                          <p className="mb-0"><i className="fas fa-eye"></i> 3,179,429 views</p>
                                       </div>
                                       <div className="single-video-author box mb-3">
                                          <div className="float-right"><button className="btn btn-danger" type="button">Subscribe <strong>1.4M</strong></button> <button className="btn btn btn-outline-danger" type="button"><i className="fas fa-bell"></i></button></div>
                                          <img className="img-fluid" src="assets/img/user.png" alt="" />
                                          <p><a href="#"><strong>Blake Channel</strong></a> <span title="" data-placement="top" data-toggle="tooltip" data-original-title="Verified"><i className="fas fa-check-circle text-success"></i></span></p>
                                          <small>Published on Aug 10, 2018</small>
                                       </div>
                                       <div className="single-video-info-content box mb-3">
                                          <h6>Cast:</h6>
                                          <p>Nathan Drake , Victor Sullivan , Sam Drake , Elena Fisher</p>
                                          <h6>Category :</h6>
                                          <p>Computer Science , Crash Course , Computing</p>
                                          <h6>About :</h6>
                                          <p>Hello, world! Welcome to Crash Course Computer Science! So today, we’re going to take a look at computing’s origins, because even though our digital computers are relatively new, the need for computation is not. Since the start of civilization itself, humans have had an increasing need for special devices to help manage laborious tasks, and as the scale of society continued to grow, these computational devices began to play a crucial role in amplifying our mental abilities. From the abacus and astrolabe to the difference engine and tabulating machine, we’ve come a long way to satisfying this increasing need, and in the process completely transformed commerce, government, and daily life. 
                                          </p>
                                          <h6>Tags :</h6>
                                          <p className="tags mb-0">
                                             <span><a href="#">Computer Science</a></span>
                                             <span><a href="#">Crash Course</a></span>
                                             <span><a href="#">Computing</a></span>
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col-md-4">
                                    <div className="single-video-right">
                                       <div className="row">
                                          <div className="col-md-12">  
                                             </div>

                                             {/*
                                             <div className="chatBoxShowHide">
                                                <button type="button" className="collapsible">Chat Room</button>   
                                                <div className="containerChat">
                                                   <p>
                                                      <a className="container img">
                                                      <img alt="Avatar" src="assets/img/icon1.png" style={{width: '10%'}} />
                                                      </a></p><p className="chat"><a className="container img">Hello. Good Video</a></p><a className="container img">
                                                      <span className="time-right">11:00</span>
                                                      <img alt="Avatar" src="assets/img/icon2.png" style={{width: '10%'}} />
                                                      <p className="chat">Hello. Keep it up</p>
                                                      <span className="time-right">11:05</span>
                                                      </a>
                                                   <p />
                                                </div>
                                             </div>
                                             
                                    
                                          <script>
                                             var coll = document.getElementsByclassName("collapsible");
                                             var i;
                                             
                                             for (i = 0; i < coll.length; i++) {
                                             coll[i].addEventListener("click", function() {
                                                this.classList.toggle("active");
                                                var content = this.nextElementSibling;
                                                if (content.style.display === "block") {
                                                   content.style.display = "none";
                                                } else {
                                                   content.style.display = "block";
                                                }
                                             });
                                             }
                                             </script>
                                          */}
                                       <div className="row">
                                          <div className="col-md-12">  
                                             </div>
                                             <div className="main-title">
                                                <h6>Up Next</h6>
                                             </div>
                                          </div>
                                          <div className="col-md-12">
                                             <div className="video-card video-card-list">
                                                <div className="video-card-image">
                                                   <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                                   <a href="#"><img className="img-fluid" src="assets/img/v1.png" alt="" /></a>
                                                   <div className="time">3:50</div>
                                                </div>
                                                <div className="video-card-body">
                                                   <div className="video-title">
                                                      <a href="#">Here are many variati of passages of Lorem</a>
                                                   </div>
                                                
                                                   <div className="video-view">
                                                      1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                                                   </div>
                                                </div>
                                             </div>
                                             <div className="video-card video-card-list">
                                                <div className="video-card-image">
                                                   <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                                   <a href="#"><img className="img-fluid" src="assets/img/v2.png" alt="" /></a>
                                                   <div className="time">3:50</div>
                                                </div>
                                                <div className="video-card-body">
                                                   <div className="video-title">
                                                      <a href="#">Duis aute irure dolor in reprehenderit in.</a>
                                                   </div>
                                                
                                                   <div className="video-view">
                                                      1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                                                   </div>
                                                </div>
                                             </div>
                                             <div className="video-card video-card-list">
                                                <div className="video-card-image">
                                                   <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                                   <a href="#"><img className="img-fluid" src="assets/img/v3.png" alt="" /></a>
                                                   <div className="time">3:50</div>
                                                </div>
                                                <div className="video-card-body">
                                                   <div className="video-title">
                                                      <a href="#">Culpa qui officia deserunt mollit anim</a>
                                                   </div>
                                                
                                                   <div className="video-view">
                                                      1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                                                   </div>
                                                </div>
                                             </div>
                                             <div className="video-card video-card-list">
                                                <div className="video-card-image">
                                                   <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                                   <a href="#"><img className="img-fluid" src="assets/img/v4.png" alt="" /></a>
                                                   <div className="time">3:50</div>
                                                </div>
                                                <div className="video-card-body">
                                                   <div className="video-title">
                                                      <a href="#">Deserunt mollit anim id est laborum.</a>
                                                   </div>
                                                
                                                   <div className="video-view">
                                                      1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                                                   </div>
                                                </div>
                                             </div>
                                             <div className="video-card video-card-list">
                                                <div className="video-card-image">
                                                   <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                                   <a href="#"><img className="img-fluid" src="assets/img/v5.png" alt="" /></a>
                                                   <div className="time">3:50</div>
                                                </div>
                                                <div className="video-card-body">
                                                   <div className="video-title">
                                                      <a href="#">Exercitation ullamco laboris nisi ut.</a>
                                                   </div>
                                                
                                                   <div className="video-view">
                                                      1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                                                   </div>
                                                </div>
                                             </div>
                                             <div className="video-card video-card-list">
                                                <div className="video-card-image">
                                                   <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                                   <a href="#"><img className="img-fluid" src="assets/img/v6.png" alt="" /></a>
                                                   <div className="time">3:50</div>
                                                </div>
                                                <div className="video-card-body">
                                                   <div className="video-title">
                                                      <a href="#">There are many variations of passages of Lorem</a>
                                                   </div>
                                                
                                                   <div className="video-view">
                                                      1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                                                   </div>
                                                </div>
                                             </div>
                                          
                                             <div className="video-card video-card-list">
                                                <div className="video-card-image">
                                                   <a className="play-icon" href="#"><i className="fas fa-play-circle"></i></a>
                                                   <a href="#"><img className="img-fluid" src="assets/img/v2.png" alt="" /></a>
                                                   <div className="time">3:50</div>
                                                </div>
                                                <div className="video-card-body">
                                                   <div className="video-title">
                                                      <a href="#">Duis aute irure dolor in reprehenderit in.</a>
                                                   </div>
                                                
                                                   <div className="video-view">
                                                      1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
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

export default VideoPage;