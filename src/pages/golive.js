import React, { Fragment } from 'react';
import {useState, useEffect, useRef} from 'react';
import { useParams } from "react-router-dom";

import '../css/weteach-main.css';
import '../css/weteach-golive.css';

import axios from 'axios';
import moment from 'moment-timezone';

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

import {dbdaemon} from '../components/janus/settings'
import { func } from 'prop-types';
let camStream = null;
let janus, chanus;
var opaqueId = "screensharingtest-"+Janus.randomString(12);
var capture, room, role, myid, source, spinner, roomid;
var localTracks = {}, localVideos = 0,
	remoteTracks = {}, remoteVideos = 0;
let vidStream = null;
let screenStream = null;
let outStream = new MediaStream([]);
let localCam = null;
let localVid = null;
var myusername; // maybe replace with localStorage.getItem("name") === null ? Janus.randomString(12) : localStorage.getItem("name")
var participants = {};
var transactions = {};
let livestream, textroom, recstream;
let stage = 0;
let live = 0;
let recording = 0;
let chatbox = document.getElementById("chatbox");
let token, luser;

let mediaID = "";

const chatStyle = {
  fontSize: '16px',
	height: '200px'
};


function GoLive() {

	//This is called on page laod.

  document.title = "WeTeach - Go Live";

	var thumbnail = process.env.PUBLIC_URL + "/img/thumbs.png";

		//Dummy token to be overwritten by the API call with data from the database.
     const [media, setMedia] = useState({
								id: "",
                name: "",
                description: "",
                liveStatus: -1,
								startDateTime: "",
								sponsor: "",
                disciplines: [],
               	videoConferenceId: 0,
								user: 1,
								author: "",

          });

					//Gets ID from url
          const { id } = useParams();
					token = localStorage.getItem("token");
					//Gets JWT token for authentication
					luser = localStorage.getItem("user") === null ? 0 : localStorage.getItem("user");
					myusername = localStorage.getItem("name") + "#" + localStorage.getItem("user");


					//sets the local media object information from database
          useEffect(() => {
                axios
                  .get(`${dbdaemon}/api/v1/media/${id}`)
                  .then((res) => {
                        setMedia({
	                        id: res.data._id,
	                        name: res.data.name,
	                        description: res.data.description,
	                        liveStatus: res.data.liveStatus,
	                        disciplines: res.data.disciplines,
	                        videoConferenceId: res.data.videoConferenceId,
													user: localStorage.getItem("user"),
													author: res.data.createdByName,
													sponsor: res.data.sponsoredByName
                        });
												mediaID = res.data._id;
                  })
                  .catch((e) => {
                        console.log(e);
                  });
          }, [id]);

  useEffect(() => {

    getMedia(); // Gets User Media objects (Webcam and Microphone)
		document.getElementById("startButton").disabled = true;
    initJanus(); // Initialises a connection to the janus server
		document.getElementById("mic-mute-button").style.backgroundImage = `url(${unmutedIcon})`;
		document.getElementById("cam-mute-button").style.backgroundImage = `url(${cameraOnIcon})`;
		document.getElementById("screen-mute-button").style.backgroundImage = `url(${screenshareOnIcon})`;
		document.getElementById("swapButton").style.backgroundImage = `url(${screenshareOffSwap})`;
		document.getElementById("swapButton").disabled = true;
		document.getElementById("stopButton").disabled = true;

		//sets states of userinterface

  });
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      document.getElementById("chatSubmit").click();
			//sends chat message
    }
  };

	//Returns ui
  return (
    			<Fragment>
			<div id="content-all">
			<div className="col-md-12">
									<div className="main-title">
									{id === "test" ? <Fragment><h3><span className="title">Test Your Device</span></h3></Fragment> : <Fragment><h3><span className="title">{media.name}</span></h3>
									<h6>Go Live Interface</h6>
									</Fragment>}
									</div>

									<div style={{"position":"relative","left":"0px","width":"fit-content"}} className="live1"></div>
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
                            <button id="startButton" onClick={confirmStartStream} className='btn btn-go-live'>Start Stream</button>
                          </td>
                          <td>
							<button id="stopButton" onClick={confirmStopStream} className='btn btn-stop' style={{display:"none"}}>Stop Stream</button>
                          </td>

						  <td id="streamConcludedText" className="streamConcludedText" >
							Stream has concluded! <a href="/media/new">Click here</a> to start a new stream!
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
						 {id === "test" ? null :
						 <Fragment>
						 <p className="tags mb-0">
                                          {media.disciplines.map((tag, k) => <Fragment><span><a href="#v" key={k}>{tag}</a></span>&nbsp;&nbsp;</Fragment>)}
                                          </p><br /><br />
						 </Fragment> }
						 <div className="single-video-info-content box mb-3">
						 {id === "test" ? <Fragment><p>Test your camera for live streaming here</p></Fragment> : <Fragment>
						 <h6>Stream Details:</h6>
						  <p className="video-metadata"><span className="video-metadata-key"><i className="far fa-comment-dots	"></i>&nbsp;&nbsp;Description:</span><span>&nbsp;&nbsp;{media.description}</span><br /></p>
						  <p className="video-metadata"><span className="video-metadata-key"><i className="fas fa-chalkboard-teacher"></i>&nbsp;&nbsp;Presenter:</span><span>&nbsp;&nbsp;{media.author}</span><br /></p>
						  <p className="video-metadata"><span className="video-metadata-key"><i className="fas fa-book-reader"></i>&nbsp;&nbsp;Content Creators:</span>&nbsp;&nbsp;{media.sponsor}</p>
						  <p className="video-metadata"><span className="video-metadata-key"><i className="far fa-calendar-alt"></i>&nbsp;&nbsp;Scheduled Date:</span>&nbsp;&nbsp;{moment(media.startDateTime).tz("Australia/Sydney").format('MMMM DD yyyy')}</p>
						  <p className="video-metadata"><span className="video-metadata-key"><i className="far fa-clock"></i>&nbsp;&nbsp;Scheduled Start Time:</span>&nbsp;&nbsp;{moment(media.startDateTime).tz("Australia/Sydney").format('hh:mm')}</p>
						 <br /></Fragment>
						 }
						 </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
    </Fragment>
  );
}

async function getMedia(){
  localCam = document.getElementById('local_cam');
  localVid = document.getElementById('local_vid');
  camStream = await navigator.mediaDevices.getUserMedia({
         video: { mediaSource: "camera" },
         audio: true
       });
			 //Creates MediaStream object with the webcam and mic
	 displayMedia()
}

function displayMedia(){
	//populates the web elements so the streamer can see the stream layout. It then also runs a check to see if the screen is being recorded.

	if (stage == 0) {
		localCam.srcObject = null;
		localVid.srcObject = new MediaStream([camStream.getVideoTracks()[0]]);
		if (screenStream != null) {
			screenStream.getVideoTracks()[0].enabled = false;
		}
	} else {
		localVid.srcObject = new MediaStream([screenStream.getVideoTracks()[0]]);
		localCam.srcObject = new MediaStream([camStream.getVideoTracks()[0]]);
		if (screenStream != null) {
			screenStream.getVideoTracks()[0].enabled = true;
		}
	}
}

function confirmStartStream(){
	const response = window.confirm("Are you sure you want to go live?");
	if(response){
		startLiveStream();
	}
}

function confirmStopStream(){
	const response = window.confirm("Are you sure you want to stop livestream?");
	if(response){
		stopStream();
	}
}

async function stopStream(){
	// Stops the recording and ends the janus instance

	livestream.send({
		message: {
			request : "configure",
			room: room,
			record: false,
			filename: room.toString(),
			display: myusername

		},
		success: function(){
			console.log("Sent end record publish request")
			//Creates and sends a request to stop the recording.
		}
	});

	sendData("Stream has concluded, thank you for attending!");
	//sends a message to stop the stream
	livestream.send({ message: { request: "stop" } });
	livestream.hangup();
	janus.destroy();

	//gracefully stops the janus instance by sending

	document.getElementById("stopButton").style.display='none';
	localVid.srcObject = null;
	localCam.srcObject = null;
	document.getElementById("local_vid").style.borderStyle = "hidden";

	document.getElementById("mic-mute-button").disabled = true;
	document.getElementById("cam-mute-button").disabled = true;
	document.getElementById("screen-mute-button").disabled = true;
	document.getElementById("swapButton").disabled = true;

	document.getElementById("streamConcludedText").style.visibility = " visible";
	document.getElementById("local_vid").style.borderStyle = "hidden";
	//stops media capture and sets the UI elements to a end of stream state.



	let token = localStorage.getItem("token");
	let luser = localStorage.getItem("user") === null ? 0 : localStorage.getItem("user");

	//sends a end of stream call to the API to update the record in the databse to a recording.
	axios
	  .get(`${dbdaemon}/api/v1/media/${mediaID}`)
	  .then((res) => {

			axios
			.post(`${dbdaemon}/api/v1/media/${mediaID}/stream/end?token=${token}`, JSON.stringify({"user": luser}), {headers: {'Content-Type': 'application/json'}})
			.then((res) => {

	  })
	  .catch((e) => {
			console.log(e); // If DB operation POST fails
	  });
	  })
	  .catch((e) => {
			console.log(e); // If DB operation GET fails
	  });

}

async function swapScreen(){
	stage = 1;
	try {
		if (screenStream == null && live == 0) {
			screenStream = await navigator.mediaDevices.getDisplayMedia({video:{ mediaSource: "screen" }, replace: true});
			//enables screen capture for the stream
		} else if(screenStream == null && live == 1){
			screenStream = await navigator.mediaDevices.getDisplayMedia({video:{ mediaSource: "screen" }, replace: true});
			console.log("Adding track vid 2");
			//enables screen capture for the stream

			//sends new stream to the active live stream
			livestream.createOffer({
				tracks:[{ type: 'screen',  mid:'2', capture: screenStream.getVideoTracks()[0], recv: false, add: true}],
				success: function(jsep){
					livestream.send({ message: { video: true }, jsep: jsep });
					var publish = { request: "configure", audio: true, video: true, data: true };
					livestream.send({ message: publish, jsep: jsep });
					console.log("ADDED SECOND SCREEN");
				}
		});
		} else {
			screenStream = await navigator.mediaDevices.getDisplayMedia({video:{ mediaSource: "screen" }, replace: true});
			console.log("Replacing track vid 2");
			//enables screen capture for the stream

			//replaces existing screen element with new screen object
			livestream.replaceTracks({
				tracks:[
					{ type: 'screen',  mid:'2', capture: screenStream.getVideoTracks()[0], recv: false, replace: true}],
					success: function(jsep) {
            livestream.send({ message: { video: true }, jsep: jsep });
        }});
		}

	} catch (e) {
		console.log(e);
		console.log("no track, continuing");
	}
	displayMedia(); //refreshes UI element for the
}

async function muteMic(){
	//runs a toggle for the microphone object and updates ui elements
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
	//runs a toggle for the camera object and updates ui elements
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
	//runs a toggle for the screen object and updates ui elements, ensuring the camera

  if (screenStream == null) {
    swapScreen();
		document.getElementById("swapButton").disabled = false;
		document.getElementById("screen-mute-button").style.backgroundImage = `url(${screenshareOffIcon})`;
  } else if(stage == 1){
    stage = 0;
    document.getElementById("screen-mute-button").style.backgroundImage = `url(${screenshareOnIcon})`;
		displayMedia();
		sendData("/swap");
  } else{
    stage = 1;
    document.getElementById("screen-mute-button").style.backgroundImage = `url(${screenshareOffIcon})`;
		displayMedia();
		sendData("/swap");
  }
}

function initJanus(){
    Janus.init({debug: "all", callback: function() {
        if(!Janus.isWebrtcSupported()) {
    console.log("No WebRTC support... ");
    return;
        }
        janus = new Janus(
					//creates new janus instance
    {
			server: server,
      success: function() {
        console.log("Janus loaded");

				//on successfull load, attacch the video room object
        janus.attach({
          plugin: "janus.plugin.videoroom",
          opaqueId: opaqueId,
          success: function(pluginHandle) {
              livestream = pluginHandle;
							// creates addressable object for the livestream
							Janus.log("Plugin attached! (" + livestream.getPlugin() + ", id=" + livestream.getId() + ")");
							var body = { request: "setup" };
							Janus.debug("Sending message:", body);
							livestream.send({ message: body });

							// if succesfull attaches a object for the chat room
							janus.attach({
								plugin: "janus.plugin.textroom",
								opaqueId: opaqueId,
								success: function(chatHandle) {
									textroom = chatHandle;
									// creates addressable object for the chat room
									console.log("-- Chatroom Plugin Loaded --");
									let body = { request: "setup" };
									Janus.debug("Sending message:", body);
									textroom.send({ message: body });
									document.getElementById("startButton").disabled = false;

									//if all is good, the ui element to start the stream becomes avaliable.

								},
								error: function(error){console.error(error)},
								onmessage: function(msg, jsep) {
									if(jsep) {
										// Answer
										textroom.createAnswer(
											{
												jsep: jsep,
												// We only use datachannels
												tracks: [
													{ type: 'data' }
												],
												success: function(jsep) {
													Janus.debug("Got SDP!", jsep);
													let body = { request: "ack" };
													textroom.send({ message: body, jsep: jsep });
												},
												error: function(error) {
													Janus.error("WebRTC error:", error);
												}
											});
									}
								},
								ondataopen: function(label, protocol){
									console.log("Datachannel Open");
								},
								ondata: function(data) {
									console.log("Data Recived: " + data);
									//on incoming message, send the message to the decoder for display
									if(JSON.parse(data)["textroom"] == "message"){
										chatbox = document.getElementById("chatbox");
										chatbox.value += (formatChatMsg(data)+"\n");
										chatbox.scrollTop = chatbox.scrollHeight;
									}
								}
							});


          },
          error: function(error) {console.error(error)},
          onmessage: function(msg, jsep) {
            Janus.debug(" ::: Got a message (publisher) :::", msg);
            var event = msg["videoroom"];
            Janus.debug("Event: " + event);

            if(event){
              if (event === "joined") {
								myid = msg["id"];
								//on successfull connection to the janus server, get our assigned room key
                Janus.log("Successfully joined room " + msg["room"] + " with ID " + myid);
                Janus.debug("Negotiating WebRTC stream for our screen (capture " + capture + ")");
								//runs a check to see if screen share is enabled and starts a live stream with the mediaStream object(s)
									if (screenStream == null) {
										livestream.createOffer({
											tracks: [
												{ type: 'audio',  mid:'0', capture: camStream.getAudioTracks()[0], recv: true },
												{ type: 'video',  mid:'1', capture: camStream.getVideoTracks()[0], recv: true }
											],
											success: function(jsep) {
												Janus.debug("Got publisher SDP!", jsep);
												Janus.log("Got publisher SDP!", jsep);
												var publish = { request: "configure", audio: true, video: true, data: true };
												livestream.send({ message: publish, jsep: jsep });
												//starts stream
											},
											error: function(error) {
												Janus.error("WebRTC error:", error);
												console.error("WebRTC error... " + error.message);
											}
										});
									} else {
										livestream.createOffer({
											tracks: [
												{ type: 'audio',  mid:'0', capture: camStream.getAudioTracks()[0], recv: true },
												{ type: 'video',  mid:'1', capture: camStream.getVideoTracks()[0], recv: true },
												{ type: 'screen',  mid:'2', capture: screenStream.getVideoTracks()[0], recv: true}
											],
											success: function(jsep) {
												Janus.debug("Got publisher SDP!", jsep);
												Janus.log("Got publisher SDP!", jsep);
												var publish = { request: "configure", audio: true, video: true, data: true };
												livestream.send({ message: publish, jsep: jsep });
												//starts stream
											},
											error: function(error) {
												Janus.error("WebRTC error:", error);
												console.error("WebRTC error... " + error.message);
											}
										});
									}

              } else if(msg["error"]) {
                  console.error(msg["error"]);
                }
              }

						if(jsep) {
							Janus.debug("Handling SDP as well...", jsep);
							livestream.handleRemoteJsep({ jsep: jsep });
						}
          },
          ondataopen: function(data) {
            Janus.log("The DataChannel is available!");
          },
          oncleanup: function() {
            Janus.log(" ::: Got a cleanup notification :::");
            //$('#datasend').attr('disabled', true);
          }
        });



      },
      error: function(error) {
				//On error, resets page for secondary attempt
        Janus.error(error);
        janus = null;
				camStream = null;
				vidStream = null;
			},
      destroyed: function() {
				//On destroy, clears the janus variable and updates the database record that the stream is over.
				janus = null;
				axios
					.get(`${dbdaemon}/api/v1/media/${mediaID}`)
					.then((res) => {

						axios
						.post(`${dbdaemon}/api/v1/media/${mediaID}/stream/stop?token=${token}`, JSON.stringify({"user": luser}), {headers: {'Content-Type': 'application/json'}})
						.then((res) => {

					})
					.catch((e) => {
						console.log(e); // Add POST error handling here
					});


					})
					.catch((e) => {
						console.log(e);// Add GET error handling here. Stream doesn't exist.
					});

      }
            });

    }});
}

function startLiveStream() {
	// Create a new room and set up parameters.
  capture = "screen";
  var desc = "Test transmit Page";
	var role = "publisher";
	var create = {
		request: "create",
		description: desc,
		bitrate: 500000,
		publishers: 1,
		rec_dir: "/weteach/data/"
	};
	livestream.send({ message: create, success: function(result) {
		var event = result["videoroom"];
		Janus.debug("VR Event: " + event);
		if(event) {
			// Once a live stream is created a user can join
			room = result["room"];
			Janus.log("Screen sharing session created: " + room);
			var register = {
				request: "join",
				room: room,
				ptype: "publisher",
				display: myusername
			};
			livestream.send({ message: register, success: function(){
				//creates the chatroom with the same id
				console.log("Creating textroom with room id: " + room);
				var create = {
					request: "create",
					textroom: "create",
					room: room,
					description: desc,
					transaction: randomString(12)
				}
				textroom.send({message: create, success: function(result) {
					var event = result["textroom"];
					Janus.debug("TR Event: " + event);
					var register = {
						textroom: "join",
						room: room,
						username: myusername,
						display: myusername,
						transaction: randomString(12),
					};
					textroom.data({text: JSON.stringify(register)});
					//Joins chat as user

					//starts the live stream
					livestream.send({
						message: {
							request : "configure",
							room: room,
							record: true,
							filename: room.toString(),
							display: myusername

						},
						success: function(){
							console.log("Sent record publish request")
							recording = 1;
							//once stream recording starts, a api call is made to create the recording refference
							console.log("ATTEMPING NFO WRITE");
							axios
								.get(`${dbdaemon}/api/v1/media/${mediaID}`)
								.then((res) => {
									axios
									.post(`${dbdaemon}/api/v1/media/${mediaID}/stream/filegen?token=${token}`, JSON.stringify({"VCID": room}), {headers: {'Content-Type': 'application/json'}})
									.then((res) => {
										console.log("WRITTEN NFO FILE");
								})
								.catch((e) => {
									console.log(e); // Add POST error handling here
								});
								})
								.catch((e) => {
									console.log(e);// Add GET error handling here. Stream doesn't exist.
								});

						}
					});

				}});

			}});

			//once the stream has started, and API call updates the information in the database to reflect that including the room refference ID

	axios
	  .get(`${dbdaemon}/api/v1/media/${mediaID}`)
	  .then((res) => {

			axios
			.post(`${dbdaemon}/api/v1/media/${mediaID}/stream/start?token=${token}`, JSON.stringify({"VCID": room, "user": luser}), {headers: {'Content-Type': 'application/json'}})
			.then((res) => {

	  })
	  .catch((e) => {
			console.log(e); // Add POST error handling here
	  });


	  })
	  .catch((e) => {
			console.log(e);// Add GET error handling here. Stream doesn't exist.
	  });

		}
	}});

	live = 1;
	document.getElementById("startButton").disabled = true;
	document.getElementById("startButton").style.display='none'
	document.getElementById("stopButton").disabled = false;
	document.getElementById("stopButton").style.display='inline-block';
	document.getElementById("local_vid").style.borderStyle = "solid";
	//UI elements are updated to reflect the live stream controls.
}

//Runs format on chat messages before displaying them. Also checks for commands
function formatChatMsg(data){
	var msg = JSON.parse(data);

	if (msg.text[0] == '/' && msg["from"] == myusername) {
		parseCommand(msg.text.substring(1,msg.text.length))
		return "["+getDateString(msg.time) + "] Command: " + msg.text;
	} else if(msg.text[0] == '/') {
		parseCommand(msg.text.substring(1,msg.text.length))
	} else {
		return "["+getDateString(msg.time) + "] " + msg["from"] + ": "+msg.text;
	}
}

function parseCommand(command){
	 //runs commands
	 if (command == "swap") {
		 console.log("Swapping Screens");
	 }

	 return;

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
// To generate random transactions IDs
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
	textroom.data({
		text: JSON.stringify(message),
		error: function(reason) { Janus.log(reason); },
		success: function(message) {}
	});
  var msgBox = document.getElementById("msg_box");
  msgBox.value = "";
}

export default GoLive;
