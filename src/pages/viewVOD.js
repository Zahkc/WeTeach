import React, { Fragment } from 'react';
import {useState, useEffect, useRef} from 'react';

import '../css/weteach-main.css';
import '../css/weteach-golive.css';

import axios from 'axios';

import Janus from '../components/janus/janus'
import {Spinner} from 'spin.js';
import {server, iceServers} from '../components/janus/settings'


let stream = new MediaStream([])
let camStream = new MediaStream([])
let janusInstance, setJanusInstance, janus;
var opaqueId = "screensharingtest-"+Janus.randomString(12);
var remoteFeed, screentest, room, role, myid, source, spinner, roomid;
var localTracks = {}, localVideos = 0,
	remoteTracks = {}, remoteVideos = 0;
var myusername = Janus.randomString(12);
let playback;
let stage = 0;
let localVid;
let localCam;
let chatbox = document.getElementById("chatbox");
var thumbnail = "https://i.imgur.com/MEAv9zb.png";

const chatStyle = {
  fontSize: '16px',
  resize: "none",
  overflowY: 'scroll'
};
localCam = document.getElementById("local_cam");

function WatchVOD() {
  const inputRef = useRef(null);

 function handleClick() {
   room = parseInt(inputRef.current.value);
	 startVOD();
 }

  const [janusInstance, setJanusInstance] = useState(null);
  useEffect(() => {
		localVid = document.getElementById('local_vid');
		localCam = document.getElementById('local_cam');
    initJanus();
  });
	document.title = "WeTeach - View Stream";

  return (

    <Fragment>
      <div id="content-all">
			<div className="col-md-3">
									<div className="main-title">
									<h3><span className="title">View Stream</span></h3>
									</div>

			</div><br />

           <div id="content-wrapper">
              <div className="container-fluid pb-0">
                <div className="video-block section-padding">
                  <div className="row">
                      <div className="col-md-5">
						<div className="single-video-left">
						<div className="single-video" style = {{verticalAlign:"unset"}}>

						<video
							width="100%"
							frameBorder="0"
							volume="0"
							className="App-video"
							id="local_vid"
							allowFullScreen="1"
							autoPlay
              controls
              poster={thumbnail}
              onPause={handlePause}
              onPlay={handlePlay}
              ></video>
							<table><tbody>
                            <tr>
                              <td>
                              <input type="text" ref={inputRef} id="title" placeholder="Enter Session ID"></input>
                              <button className="btn btn-primary" onClick={handleClick} id="connect">connect</button>
                              <button className="btn btn-primary" onClick={leaveStream} id="disconnect">disconnect</button>
                              </td>
                            </tr></tbody>
                          </table>
						</div>


						</div></div>
						<div className="col-md-5 reducible">
						<div className="single-video-right">
                            <div className="single-video2">
                            <video className="App-camera" id="local_cam" width="80%" autoPlay></video>
							</div>
                            <div className = "containerChat"><div>
							<textarea disabled className="chat_window" id ="chatbox" style={chatStyle}></textarea></div>

							</div>

						 </div></div>


						 <div className="single-video-info-content box mb-3">
                                          <p>{/*Stream Date & Time*/}</p>
                                          <h6>About:</h6>
                                          <p>Test your input devices before streaming
                                          </p>
                                          <h6>Disciplines:</h6>
                                          <p className="tags mb-0">
                                             <span><a href="#v">IT</a></span>&nbsp;&nbsp;
                                             <span><a href="#v">Computing</a></span>&nbsp;&nbsp;
                                          </p><br />
						 </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
    </Fragment>
  );
}

function initJanus(){

	Janus.init({debug:"all", callback: function(){
		if(!Janus.isWebrtcSupported()) {
			console.log("No WebRTC support... ");
			return;
		}

		janus = new Janus(
			{
				server: server,
				success: function(){
					console.log("Janus Loaded");
					janus.attach({
						plugin:"janus.plugin.recordplay",
						opaqueId: opaqueId,
						success: function(pluginHandle){
							playback = pluginHandle;
							console.log("Connected to Record Daemon");
						},
						error: function(error) {console.error(error)},
						onmessage: function(msg, jsep){
							Janus.debug(" ::: Got a message :::", msg);
							let result = msg["result"];
							if(result) {
								if (result["status"]) {
									if (result["status"] === 'preparing' || result["status"] === 'refreshing') {
										Janus.log("Preparing the recording playout");
										playback.createAnswer(
											{
												jsep: jsep,
												tracks: [
													{ type: 'data' }
												],
												success: function(jsep) {
													Janus.debug("Got SDP!", jsep);
													let body = { request: "start" };
													playback.send({ message: body, jsep: jsep });
												},
												error: function(error) {
													Janus.error("WebRTC error:", error);
												}
											});
									}
								}
							}
						},
						onremotetrack: function(track, mid, on) {
				      Janus.debug("Remote track (mid=" + mid + ") " + (on ? "added" : "removed") + ":", track);

				      if(track.kind === "audio") {
				        // New audio track: create a stream out of it, and use a hidden <audio> element
				        camStream.addTrack(track);
				        Janus.log("Created remote audio stream:", camStream);
				      } else {
				        // New video track: create a stream out of it

								if (mid == 1 && stage == 0) {
									camStream.addTrack(track);
									Janus.log("Created remote video stream:", camStream);
									Janus.log("Created remote video stream:", stream);
									localVid = document.getElementById('local_vid');
									localVid.srcObject = camStream;
									localCam = document.getElementById('local_cam');
									localCam.srcObject = null;
									stage = 0;
								}

								if (mid == 2) {
									stream.addTrack(track);
									Janus.log("Created remote video stream:", camStream);
									Janus.log("Created remote video stream:", stream);
									localVid = document.getElementById('local_vid');
									localVid.srcObject = stream;
									localCam = document.getElementById('local_cam');
									localCam.srcObject = camStream;
									stage = 1;
								}

				      }
				    }
					});
				}
			}
		)

	}});

}

function startVOD(){
	playback.send({
		message: {
			request: "play",
			id: room
		}
	});
}


function leaveStream(){
	janus.destroy();
}


// Just an helper to generate random usernames
function randomString(len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz,randomPoz+1);
  }
  return randomString;
}

function handlePause(){
    localCam.pause();
		playback.send({message: {request: 'pause'}});
}
function handlePlay(){
  localCam.play();
	playback.send({message: {request: 'resume'}});
}

function getDateString(jsonDate) {
	var when = new Date();
	if(jsonDate) {
		when = new Date(Date.parse(jsonDate));
	}
	var dateString =
			("0" + when.getUTCHours()).slice(-2) + ":" +
			("0" + when.getUTCMinutes()).slice(-2) + ":" +
			("0" + when.getUTCSeconds()).slice(-2);
	return dateString;
}
// Sends chat message
function formatChatMsg(data){
	var msg = JSON.parse(data);

	if (msg.text[0] == '/' && msg["from"] == myusername) {
		parseCommand(msg.text.substring(1,msg.text.length))
		return "["+msg.time + "] Command: " + msg.text;
	} else if(msg.text[0] == '/') {
		parseCommand(msg.text.substring(1,msg.text.length))
	} else {
		return "["+msg.time + "] " + msg["from"] + ": "+msg.text;
	}
}

function parseCommand(command){
	 //runs commands
	 if (command == "swap") {
		 console.log("Swapping Screens");
		 swapScreen();

	 }

	 return;

}

function swapScreen(){
	if (stage == 0) {
		stage = 1;
		localCam.srcObject = camStream;
		localVid.srcObject = stream;
	} else if (stage == 1) {
		stage = 0;
		localVid.srcObject = camStream;
		localCam.srcObject = null;
	}
}

export default WatchVOD;
