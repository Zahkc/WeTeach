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
import {dbdaemon} from '../components/janus/settings'

let stream = new MediaStream([])
let camStream = new MediaStream([])
let janusInstance, setJanusInstance, janus;
var opaqueId = "screensharingtest-"+Janus.randomString(12);
var remoteFeed, screentest, room, role, myid, source, spinner, roomid;
var localTracks = {}, localVideos = 0,
	remoteTracks = {}, remoteVideos = 0;
var myusername;
let textroom;
let stage = 0;
let localVid;
let localCam;
let chatbox = document.getElementById("chatbox");
var thumbnail = "https://i.imgur.com/MEAv9zb.png";
let params, mdata;

const chatStyle = {
  fontSize: '16px',
  resize: "none",
  overflowY: 'scroll'
};
localCam = document.getElementById("local_cam");

function WatchLive() {
 document.title = "WeTeach - Watch Live";
  const inputRef = useRef(null);

 function handleClick() {
   room = parseInt(inputRef.current.value);
   attemptConnect();
 }

  params=useParams(); // not needed
	myusername = localStorage.getItem("name") + "#" + localStorage.getItem("user");

const [media, setMedia] = useState({
                id: "",
                name: "",
                description: "",
                liveStatus: -1,
                disciplines: [],
		videoConferenceId: 0
          });

          const { id } = useParams();
          var thumbnail = process.env.PUBLIC_URL + "/img/thumbs.png";

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
                        });
                  })
                  .catch((e) => {
                        console.log(e);
                  });
          }, [id]);

  const [janusInstance, setJanusInstance] = useState(null);
  useEffect(() => {
		localVid = document.getElementById('local_vid');
		localCam = document.getElementById('local_cam');
    initJanus();
  });
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      document.getElementById("chatSubmit").click();
    }
  };
	document.title = "WeTeach - View Stream";

  return (

(media.liveStatus === 0) || (media.liveStatus === 1) ?
    <Fragment>
      <div id="content-all">
			<div className="col-md-12">
									<div className="main-title">
									<h3><span className="title">{media.name}</span></h3>
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

                            <input
							placeholder="Enter chat message here"
							className="new_message" id = "msg_box" size="25" onKeyDown={handleKeyDown}></input>

                            <button onClick={sendData} className="btn btn-primary" id = "chatSubmit">Send</button>
							</div>

						 </div></div>


						 <div className="single-video-info-content box mb-3">
                                          <p>{moment(media.startDateTime).tz("Australia/Sydney").format('MMMM DD, yyyy H:mm')}</p>
                                          <h6>About:</h6>
                                          <p>{media.description}
                                          </p>
                                          <h6>Disciplines:</h6>
                                          <p className="tags mb-0">
                                             {media.disciplines.map((tag, k) => <Fragment><span><a href="#v" key={k}>{tag}</a></span>&nbsp;&nbsp;</Fragment>)}
                                          </p><br />
						 </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
    </Fragment> : null

  );
}


async function initJanus(){

		try{
			await getMediaReccord(params.id);
		} catch (error) {console.error(error)};

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
              Janus.log("Plugin attached! (" + screentest.getPlugin() + ", id=" + screentest.getId() + ")");
              // Prepare the username registration
							janus.attach({
								plugin: "janus.plugin.textroom",
								opaqueId: opaqueId,
								success: function(chatHandle) {
									textroom = chatHandle;
									console.log("-- Chatroom Plugin Loaded --");
									let body = { request: "setup" };
									Janus.debug("Sending message:", body);
									textroom.send({ message: body });
									attemptConnect();
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
									if(JSON.parse(data)["textroom"] == "message"){
										chatbox = document.getElementById("chatbox");
										chatbox.value += (formatChatMsg(data)+"\n");
										chatbox.scrollTop = chatbox.scrollHeight;
									}
								}
							});

          },
          error: function(error) {},
          onmessage: function(msg, jsep) {
            Janus.debug(" ::: Got a message (publisher) :::", msg);
            var event = msg["videoroom"];
            Janus.debug("Event: " + event);

            if(event){
              if (event === "joined") {

                myid = msg["id"];
                Janus.log("Successfully joined room " + msg["room"] + " with ID " + myid);

								screentest.createOffer({
									tracks: [	{ type: 'data'} ],
									success: function(jsep){
										Janus.debug("Got publisher SDP!", jsep);
										Janus.log("Got publisher SDP!", jsep);
										var publish = { request: "configure", audio: false, video: false, data: true };
										screentest.send({ message: publish, jsep: jsep });
									},
									error: function(error) {
										Janus.error("WebRTC error:", error);
										console.error("WebRTC error... " + error.message);
									}
								});

                if(msg["publishers"]) {
                  var list = msg["publishers"];
                  Janus.debug("Got a list of available publishers/feeds:", list);
                  for(var f in list) {
                    if(list[f]["dummy"])
                      continue;
                    var id = list[f]["id"];
                    var display = list[f]["display"];
                    Janus.debug("  >> [" + id + "] " + display);
                    newRemoteFeed(id, display)
                  }
                }
              } else if(event === "event") {
                if(role === "listener" && msg["publishers"]) {
                  var list = msg["publishers"];
                  Janus.debug("Got a list of available publishers/feeds:", list);
                  for(var f in list) {
                    if(list[f]["dummy"])
                      continue;
                    var id = list[f]["id"];
                    var display = list[f]["display"];
                    Janus.debug("  >> [" + id + "] " + display);
                    newRemoteFeed(id, display)
                  }
                } else if(msg["leaving"]) {
                  // One of the publishers has gone away?
                  var leaving = msg["leaving"];
                  Janus.log("Publisher left: " + leaving);
                  if(role === "listener" && msg["leaving"] === source) {
                    console.log("The screen sharing session is over, the publisher left", function() {
                      window.location.reload();
                    });
                  }
                } else if(msg["error"]) {
                  console.error(msg["error"]);
                }
              }
            }
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

function leaveStream(){
	janus.destroy();
}

function attemptConnect(){
	role = "listener";
  var register = {
		request: "join",
		room: room,
		ptype: "publisher",
		display: myusername
	};
  screentest.send({ message: register, success: function(){
		console.log(" --- Joined VideoRoom ---");
		var register = {
			textroom: "join",
			room: room,
			username: myusername,
			display: myusername,
			transaction: randomString(12),
		};
		textroom.data({text: JSON.stringify(register), success: function(){
			console.log(" --- Joined Chatroom ---");
		}});
	}});

}

function newRemoteFeed(id, display) {
  source = id;
  var remoteFeed = null;
  janus.attach({
    plugin: "janus.plugin.videoroom",
    opaqueId: opaqueId,
    success: function(pluginHandle) {
      remoteFeed = pluginHandle;
      remoteFeed.remoteTracks = {};
      remoteFeed.remoteVideos = 0;
      Janus.log("Plugin attached! (" + remoteFeed.getPlugin() + ", id=" + remoteFeed.getId() + ")");
      Janus.log("  -- This is a subscriber");
      // We wait for the plugin to send us an offer
      var listen = {
        request: "join",
        room: room,
        ptype: "subscriber",
        feed: id
      };
      remoteFeed.send({ message: listen });
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
          if(!spinner) {
            var target = document.getElementById('#local_vid');
            spinner = new Spinner({top:100}).spin(target);
          } else {
            spinner.spin();
          }
          Janus.log("Successfully attached to feed " + id + " (" + display + ") in room " + msg["room"]);

        }
      }
      if(jsep){
        Janus.debug("Handling SDP as well...", jsep);

        remoteFeed.createAnswer(
          {
            jsep: jsep,

            tracks: [
              { type: 'data' }
            ],
            success: function(jsep) {
              Janus.debug("Got SDP!", jsep);
              var body = { request: "start", room: room };
              remoteFeed.send({ message: body, jsep: jsep });
            },
            error: function(error) {
              Janus.error("WebRTC error:", error);
              console.error("WebRTC error... " + error.message);
            }
          });

      }
    },
    ondata: function(data) {
      // Chat message recieved
			console.log(" -- Connected to chatroom --");
      chatbox = document.getElementById("chatbox");
      chatbox.value += (formatChatMsg(data)+"\n");
      chatbox.scrollTop = chatbox.scrollHeight;
		},
    onremotetrack: function(track, mid, on) {
      Janus.debug("Remote track (mid=" + mid + ") " + (on ? "added" : "removed") + ":", track);

      if(track.kind === "audio") {
        // New audio track: create a stream out of it, and use a hidden <audio> element
        camStream.addTrack(track);
        remoteTracks[mid] = stream;
        Janus.log("Created remote audio stream:", stream);
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
}

function handlePlay(){
  localCam.play();
}

async function getMediaReccord(id){
	axios.get(`https://weteach.ddns.net/api/v1/media/${id}`).then(res => {
	const mdata = res.data;
	room = mdata.videoConferenceId;
	console.log("Found room id: " + room);
	//fill out other dataspots
	}).catch((e) => console.log(e));
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

function sendData() {
	var messageText = document.getElementById("msg_box").value;
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


export default WatchLive;
