import React, { Fragment } from 'react';
import {useState, useEffect, useRef} from 'react';

import '../css/weteach-main.css';
import '../css/weteach-golive.css';

import axios from 'axios';

import Janus from '../components/janus/janus'
import {Spinner} from 'spin.js';
import {server, iceServers} from '../components/janus/settings'

import mutedIcon from '../assets/img/Mic-Off.png';
import unmutedIcon from '../assets/img/Mic-On.png';
import cameraOnIcon from '../assets/img/Camera-On.png';
import cameraOffIcon from '../assets/img/Camera-Off.png';
import screenshareOnIcon from '../assets/img/Screenshare-On.png';
import screenshareOffIcon from '../assets/img/Screenshare-Off.png';
import screenshareOffSwap from '../assets/img/Screenshare-Swap.png';
let camStream = null;
let janusInstance, setJanusInstance, janus, chanus;
var opaqueId = "screensharingtest-"+Janus.randomString(12);
var capture, screentest, room, role, myid, source, spinner, roomid;
var localTracks = {}, localVideos = 0,
	remoteTracks = {}, remoteVideos = 0;
let vidStream = null;
let screenStream = null;
let outStream = new MediaStream([]);
let localCam = null;
let localVid = null;
var myusername = Janus.randomString(12);
var participants = {};
var transactions = {};
let textroom;
let stage = 0;
let chatbox = document.getElementById("chatbox");
var thumbnail = "https://i.imgur.com/MEAv9zb.png";

const chatStyle = {
  fontSize: '16px',
};
// This is for the spinner. It needs to be in watchStream and watchVideo too. I don't know where to put it here for now
// const video = document.getElementById('local_vid');
// const spinnerObj = document.querySelector('.spinner');
// video.addEventListener('loadstart', () => {
// 	spinnerObj.style.display = 'block';
//   });
  
//   video.addEventListener('canplaythrough', () => {
// 	spinnerObj.style.display = 'none';
//   });
function GoLive() {
  const [janusInstance, setJanusInstance] = useState(null);

  useEffect(() => {
	/* Insert GET request axios.get or fetch.get to DB */
    getMedia();
    initJanus();
  });
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      document.getElementById("chatSubmit").click();
    }
  };

  return (
    <Fragment>    
			<div id="content-all">		    
			<div className="col-md-3">
									<div className="main-title">
									<h3><span className="title">Go Live</span></h3>
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
							width="80%"
							frameBorder="0"							
							volume="0"
							className="App-video"
							id="local_vid"
							allowFullScreen="1"														
							autoPlay></video>
							<table className="button-table"><tbody>
							<tr>
                          <td>
                          <button id="mic-mute-button" onClick={muteMic} className="mic-mute-button" style={{backgroundImage: `url(${unmutedIcon})`}}></button>
                          </td>
                          <td>
                            <button id="cam-mute-button" onClick={muteCam} className="mic-mute-button" style={{backgroundImage: `url(${cameraOnIcon})`}}></button>
                          </td>
                          <td>
                            <button id="screen-mute-button" onClick={toggleScreenShare} className="mic-mute-button" style={{backgroundImage: `url(${screenshareOnIcon})`}}></button>
                          </td>
                          <td>
                            <button id="swapButton" onClick={swapScreen} className="mic-mute-button" style={{backgroundImage: `url(${screenshareOffSwap})`}}></button>
                          </td>
                          <td>
                            <button id="startButton" onClick={startLiveStream} className='btn btn-go-live'>Start Stream</button>
                          </td>
                          <td>
							<button id="stopButton" onClick={stopStream} className='btn btn-stop' style={{display:"none"}}>Stop Stream</button>
                          </td>

                        </tr>
						</tbody>
                        </table>
						</div>
						
						
						</div></div>
						<div className="col-md-5 reducible">
						<div className="single-video-right">
                            <div className="single-video2">
                            <video className="App-camera" id="local_cam" width="80%" autoPlay></video>
							</div>
                            <div className = "containerChat"><div>
							<textarea disabled poster={thumbnail} className="chat_window" id ="chatbox" style={chatStyle}></textarea></div>
						
                            <input
							placeholder="Enter chat message here"
							className="new_message" id = "msg_box" size="25" onKeyDown={handleKeyDown}></input>
                           
                            <button onClick={sendData} className="btn btn-primary" id = "chatSubmit">Send</button>                           
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
										  <h6>Video Conference ID:</h6>
										  
										  <input type="text" disabled="1" id="codeDisp" defaultValue="Room Code"/>
						 </div>
                      
                      </div>
                    </div>
                  </div>
                </div>
              </div>          
    </Fragment>
  );
}

function getInfo(){
  console.log();
}

async function getMedia(){
  localCam = document.getElementById('local_cam');
  localVid = document.getElementById('local_vid');
  camStream = await navigator.mediaDevices.getUserMedia({
         video: { mediaSource: "camera" },
         audio: true
       });
  startStream()
}

async function startStream(){
	
  if (stage == 0) {
    localCam.srcObject = null;
    localVid.srcObject = new MediaStream([camStream.getVideoTracks()[0]]);
  } else {
	localVid.srcObject = new MediaStream([screenStream.getVideoTracks()[0]]);
    localCam.srcObject = new MediaStream([camStream.getVideoTracks()[0]]);
	
  }
}

async function stopStream(){
	console.log("Attempting to stop stream")
	sendData("Stream has concluded, thank you for attending!");
	screentest.send({ message: { request: "stop" } });
	screentest.hangup();
	janus.destroy();
	document.getElementById("startButton").disabled = false;
	document.getElementById("startButton").style.display='inline-block'
	
	document.getElementById("stopButton").disabled = true;
	document.getElementById("stopButton").style.display='none'
	localVid.srcObject = null;
	localCam.srcObject = null;
	document.getElementById("local_vid").style.borderStyle = "hidden";
}

async function swapScreen(){


	screenStream = await navigator.mediaDevices.getDisplayMedia({video:{ mediaSource: "screen" }, replace: true});
	stage = 1;

	console.log(camStream.getVideoTracks().length);
	try {
		if (camStream.getVideoTracks().length == 1) {
			console.log("Adding track vid 2");
			camStream.addTrack(screenStream.getVideoTracks()[0]);
		} else {
			console.log("Replacing track vid 2");

			let tracks = [];
			tracks.push({
				type:'screen',
				mid: '2',
				capture: screenStream.getVideoTracks()[0]
			});

			screentest.replaceTracks({tracks: tracks});

		}
	} catch (e) {
		console.log(e);
		console.log("no track, continuing");
	}
	
}

async function muteMic(){
  if(camStream.getAudioTracks()[0].enabled){
    document.getElementById("mic-mute-button").style.backgroundImage = `url(${mutedIcon})`;
    camStream.getAudioTracks()[0].enabled = false;
  }
  else if(!camStream.getAudioTracks()[0].enabled){
    document.getElementById("mic-mute-button").style.backgroundImage = `url(${unmutedIcon})`;
    camStream.getAudioTracks()[0].enabled = true;
  }
}

async function muteCam(){
  if(camStream.getVideoTracks()[0].enabled){
    document.getElementById("cam-mute-button").style.backgroundImage = `url(${cameraOffIcon})`;
    camStream.getVideoTracks()[0].enabled = false;
  }
  else if(!camStream.getVideoTracks()[0].enabled){
    document.getElementById("cam-mute-button").style.backgroundImage = `url(${cameraOnIcon})`;
    camStream.getVideoTracks()[0].enabled = true;
  }
}

async function toggleScreenShare(){
  if (screenStream == null) {
    swapScreen();
		document.getElementById("swapButton").disabled = false;
  }
  if(stage == 1){
    stage = 0;
    document.getElementById("screen-mute-button").style.backgroundImage = `url(${screenshareOnIcon})`;
    screenStream.getVideoTracks()[0].enabled = false;
		startStream();
		screentest.send({ message: { stage : stage } });
  }
  else{
    stage = 1;
    document.getElementById("screen-mute-button").style.backgroundImage = `url(${screenshareOffIcon})`;
    screenStream.getVideoTracks()[0].enabled = true;
		startStream();		
		screentest.send({ message: { stage : stage } });
	localVid.requestPictureInPicture();	
  }
}

function initJanus(){
    Janus.init({debug: "all", callback: function() {
        if(!Janus.isWebrtcSupported()) {
    console.log("No WebRTC support... ");
    return;
        }
        janus = new Janus(
    {
			server: server,
      success: function() {
        console.log("Janus loaded");
        janus.attach({
          plugin: "janus.plugin.videoroom",
          opaqueId: opaqueId,
          success: function(pluginHandle) {
              screentest = pluginHandle;
							textroom = pluginHandle;
							Janus.log("Plugin attached! (" + screentest.getPlugin() + ", id=" + screentest.getId() + ")");
							var body = { request: "setup" };
							Janus.debug("Sending message:", body);
							screentest.send({ message: body });
          },
          error: function(error) {},
					iceState: function(state) {
						Janus.log("ICE state changed to " + state);
					},
					mediaState: function(medium, on, mid) {
						Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium + " (mid=" + mid + ")");
					},
					webrtcState: function(on) {
						Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
						if(on) {
							console.log("Your screen sharing session just started: pass the <b>" + room + "</b> session identifier to those who want to attend.");
						} else {
							console.log("Your screen sharing session just stopped.", function() {
								janus.destroy();
								window.location.reload();
							});
						}
					},
          onmessage: function(msg, jsep) {
            Janus.debug(" ::: Got a message (publisher) :::", msg);
            var event = msg["videoroom"];
            Janus.debug("Event: " + event);

            if(event){
              if (event === "joined") {

                myid = msg["id"];
                Janus.log("Successfully joined room " + msg["room"] + " with ID " + myid);
                Janus.debug("Negotiating WebRTC stream for our screen (capture " + capture + ")");

                if(Janus.webRTCAdapter.browserDetails.browser === "safari") {
                  console.log("Rip Apple users");
                } else {
									if (camStream.getVideoTracks().length == 1) {
										screentest.createOffer({
											tracks: [
												{ type: 'audio',  mid:'0', capture: camStream.getAudioTracks()[0], recv: false },
												{ type: 'video',  mid:'1', capture: camStream.getVideoTracks()[0], recv: false },
												{ type: 'screen',  mid:'2', capture: null, recv: false },
												{ type: 'data'}
											],
											success: function(jsep) {
												Janus.debug("Got publisher SDP!", jsep);
												Janus.log("Got publisher SDP!", jsep);
												var publish = { request: "configure", audio: true, video: true, data: true };
												screentest.send({ message: publish, jsep: jsep });
											},
											error: function(error) {
												Janus.error("WebRTC error:", error);
												console.error("WebRTC error... " + error.message);
											}
										});
									} else {
										screentest.createOffer({
											tracks: [
												{ type: 'audio',  mid:'0', capture: camStream.getAudioTracks()[0], recv: false },
												{ type: 'video',  mid:'1', capture: camStream.getVideoTracks()[0], recv: false },
												{ type: 'screen',  mid:'2', capture: screenStream.getVideoTracks()[0], recv: false },
												{ type: 'data'}
											],
											success: function(jsep) {
												Janus.debug("Got publisher SDP!", jsep);
												Janus.log("Got publisher SDP!", jsep);
												var publish = { request: "configure", audio: true, video: true, data: true };
												screentest.send({ message: publish, jsep: jsep });
											},
											error: function(error) {
												Janus.error("WebRTC error:", error);
												console.error("WebRTC error... " + error.message);
											}
										});
									}


                }

              } else if(msg["error"]) {
                  console.error(msg["error"]);
                }
              }

						if(jsep) {
							Janus.debug("Handling SDP as well...", jsep);
							screentest.handleRemoteJsep({ jsep: jsep });
						}
          },
          ondataopen: function(data) {
            Janus.log("The DataChannel is available!");
						con2Chat();
          },
          oncleanup: function() {
            Janus.log(" ::: Got a cleanup notification :::");
            //$('#datasend').attr('disabled', true);
          }
        });

      },
      error: function(error) {
        Janus.error(error);
                    setJanusInstance(null);
      },
      destroyed: function() {
                    setJanusInstance(null);
      }
            });

    }});
}

function con2Chat(){
	source = screentest.getId();
	janus.attach({
		plugin: "janus.plugin.videoroom",
		opaqueId: opaqueId,
		success: function(pluginHandle) {
			textroom = pluginHandle;
			Janus.log("Plugin attached! (" + textroom.getPlugin() + ", id=" + textroom.getId() + ")");
			Janus.log("  -- This is a subscriber");
			var listen = {
				request: "join",
				room: room,
				ptype: "subscriber",
				feed: myid
			};
			textroom.send({ message: listen });
		},
		error: function(error) {
			Janus.error("  -- Error attaching plugin...", error);
			console.log("Error attaching plugin... " + error);
		},
		onmessage: function(msg, jsep) {

			Janus.debug(" ::: Got a message (listener) :::", msg);
			var event = msg["videoroom"];
			Janus.debug("Event: " + event);

			if(event){
        if(event === "attached"){
          Janus.log("Successfully attached to feed " + myid + " in room " + msg["room"]);
        }
      }
      if(jsep){
        Janus.debug("Handling SDP as well...", jsep);

        textroom.createAnswer(
          {
            jsep: jsep,

            tracks: [
              { type: 'data' }
            ],
            success: function(jsep) {
              Janus.debug("Got SDP!", jsep);
              var body = { request: "start", room: room };
              textroom.send({ message: body, jsep: jsep });
            },
            error: function(error) {
              Janus.error("WebRTC error:", error);
              console.error("WebRTC error... " + error.message);
            }
          });

      }

		},
		ondataopen: function(data) {
			console.log("SUB CONNECTED TO CHAT");
		},
		ondata: function(data) {
      // Chat message recieved
      chatbox = document.getElementById("chatbox");
      chatbox.value += (formatChatMsg(data)+"\n");
      chatbox.scrollTop = chatbox.scrollHeight;
		}
	});
}

function formatChatMsg(data){
  var msg = JSON.parse(data);
  return "["+msg.time + "] Streamer: "+msg.text;
}

function startLiveStream() {
	// Create a new room
  capture = "screen";
  var desc = "Test transmit Page";
	var role = "publisher";
	var create = {
		request: "create",
		description: desc,
		bitrate: 500000,
		publishers: 1
	};
	screentest.send({ message: create, success: function(result) {
		var event = result["videoroom"];
		Janus.debug("Event: " + event);
		if(event) {
			// Our own screen sharing session has been created, join it
			room = result["room"];
			Janus.log("Screen sharing session created: " + room);
			document.getElementById("codeDisp").value = room;
			myusername = Janus.randomString(12);
			var register = {
				request: "join",
				room: room,
				ptype: "publisher",
				display: myusername
			};
			screentest.send({ message: register });
			document.getElementById("local_vid").style.borderStyle = "solid";
		}
	}});
	document.getElementById("startButton").disabled = true;
	document.getElementById("startButton").style.display='none'
	document.getElementById("stopButton").disabled = false;
	document.getElementById("stopButton").style.display='inline-block'
}

function escapeXmlTags(value) {
	if(value) {
		var escapedValue = value.replace(new RegExp('<', 'g'), '&lt');
		escapedValue = escapedValue.replace(new RegExp('>', 'g'), '&gt');
		return escapedValue;
	}
}
// Helper to format times
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

// Sends chat message
function sendData(override) {
	let messageText = "";
	console.log(typeof(override));
	if (typeof(override) === 'string') {
		console.log("Over Ride");
		messageText = override;
	} else {
		messageText = document.getElementById("msg_box").value;
	}
	if(messageText === "") {
    // Does nothing
		return;
	}
	var message = {
		textroom: "message",
		transaction: randomString(12),
		room: room,
 		text: messageText,
    time: getDateString(false)
	};
	screentest.data({
		text: JSON.stringify(message),
		error: function(reason) { Janus.log(reason); },
		success: function(message) {}
	});
  var msgBox = document.getElementById("msg_box");
  msgBox.value = "";
}
export default GoLive;
