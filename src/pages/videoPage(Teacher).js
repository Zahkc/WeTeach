import React, { Fragment } from 'react';
import NavBar from './navBar'
import SideBarTeacher from './sidebar(Teacher)';
import ButtonChatroom from './buttonChatroom'
import UpNext from './buttonUpNext'


var srcVideoURL = "https://storage.googleapis.com/media-session/caminandes/short.mp4";
var thumbnail = "https://i.imgur.com/MEAv9zb.png";
var views = 17324;

class VideoPage extends React.Component{
   render(){
        return(
         <Fragment>
            <div>
               <NavBar/>
                  <div id="wrapper">
                     <SideBarTeacher/>
                     <div id="content-wrapper">
                        <div className="container-fluid pb-0">
                           <div className="video-block section-padding">
                              <div className="row">
                                 <div className="col-md-8">
                                    <div className="single-video-left">
                                    <div className="single-video">
                                       <video 
                                          width="100%" 
                                          height="315" 
                                          poster= {thumbnail}
                                          src={srcVideoURL}
                                          frameborder="1" 
                                          allow="encrypted-media" 
                                          allowfullscreen="true" 
                                          controls controlsList="nodownload"
                                          volume = "0.5"
                                       >
                                       </video>
                                    </div>
                                       <div className="single-video-title box mb-3">
                                          <h2><a href="#">Computer Science 101 - Lecture 1</a></h2>
                                          <h10>12th April 2023</h10>
                                          <p className="mb-0"><i className="fas fa-eye"></i> {views} views</p>
                                       </div>
                                       <div className="single-video-author box mb-3">
                                          <div className="float-right"><button className="btn btn-danger" type="button">Subscribe <strong>1.4M</strong></button> <button className="btn btn btn-outline-danger" type="button"><i className="fas fa-bell"></i></button></div>
                                          <img className="img-fluid" src="assets/img/user.png" alt="" />
                                          <p><a href="#"><strong>Blake Channel</strong></a> <span title="" data-placement="top" data-toggle="tooltip" data-original-title="Verified"><i className="fas fa-check-circle text-success"></i></span></p>
                                          <small>Published on Aug 10, 2018</small>
                                       </div>
                                       <div className="single-video-info-content box mb-3">
                                          <h6>About :</h6>
                                          <p>Hello, world! Welcome to Crash Course Computer Science! So today, we’re going to take a look at computing’s origins, because even though our digital computers are relatively new, the need for computation is not. Since the start of civilization itself, humans have had an increasing need for special devices to help manage laborious tasks, and as the scale of society continued to grow, these computational devices began to play a crucial role in amplifying our mental abilities. From the abacus and astrolabe to the difference engine and tabulating machine, we’ve come a long way to satisfying this increasing need, and in the process completely transformed commerce, government, and daily life. 
                                          </p>
                                          <h6>Tags :</h6>
                                          <p className="tags mb-0">
                                             <span><a href="#">Computer Science</a></span>
                                             <span><a href="#">Programming</a></span>
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
                                                      <span className="time-right">1:00</span>
                                                      <img alt="Avatar" src="assets/img/icon2.png" style={{width: '10%'}} />
                                                      <p className="chat">Hello. Keep it up</p>
                                                      <span className="time-right">2:05</span>
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
                                          <ButtonChatroom />
                                          <UpNext />
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