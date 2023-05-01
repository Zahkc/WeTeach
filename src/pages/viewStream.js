import React, { Fragment } from 'react';
import {useState, useEffect, useRef} from 'react';

import '../css/weteach-main.css';
import '../css/weteach-golive.css';

import axios from 'axios';

import Janus from '../components/janus/janus'
import {Spinner} from 'spin.js';
import {server, iceServers} from '../components/janus/settings'

let stream = new MediaStream([])
let screenStream = new MediaStream([])
let janusInstance, setJanusInstance, janus;
var opaqueId = "screensharingtest-"+Janus.randomString(12);
var screentest, room, role, myid, source, spinner, roomid;
var localTracks = {}, localVideos = 0,
	remoteTracks = {}, remoteVideos = 0;
var myusername = Janus.randomString(12);
let textroom;
let chatbox = document.getElementById("chatbox");
var thumbnail = "https://i.imgur.com/MEAv9zb.png";

const chatStyle = {
  fontSize: '16px',
  resize: "none",
  overflowY: 'scroll'
};
const localCam = document.getElementById("local_cam");

function WatchLive() {
  const inputRef = useRef(null);

 function handleClick() {
   room = parseInt(inputRef.current.value);
   attemptConnect();
 }

  const [janusInstance, setJanusInstance] = useState(null);
  useEffect(() => {
    initJanus();
  });
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      document.getElementById("chatSubmit").click();
    }
  };
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

    Janus.init({debug: "all", callback: function() {
        if(!Janus.isWebrtcSupported()) {
    console.log("No WebRTC support... ");
    return;
        }

        janus = new Janus(
    {
			server: server,
      // No "iceServers" is provided, meaning janus.js will use a default STUN server
      // Here are some examples of how an iceServers field may look like to support TURN
      // 		iceServers: [{urls: "turn:yourturnserver.com:3478", username: "janususer", credential: "januspwd"}],
      // 		iceServers: [{urls: "turn:yourturnserver.com:443?transport=tcp", username: "janususer", credential: "januspwd"}],
      // 		iceServers: [{urls: "turns:yourturnserver.com:443?transport=tcp", username: "janususer", credential: "januspwd"}],
      // Should the Janus API require authentication, you can specify either the API secret or user token here too
      //		token: "mytoken",
      //	or
      //		apisecret: "serversecret",
      success: function() {
        console.log("Janus loaded");
        // setJanusInstance(janus);
        // Attach to echo test plugin
        janus.attach({
          plugin: "janus.plugin.videoroom",
          opaqueId: opaqueId,
          success: function(pluginHandle) {
              screentest = pluginHandle;
              Janus.log("Plugin attached! (" + screentest.getPlugin() + ", id=" + screentest.getId() + ")");
              // Prepare the username registration
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
  screentest.send({ message: register });
  console.log(room);
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
      chatbox = document.getElementById("chatbox");
      chatbox.value += (formatChatMsg(data)+"\n");
      chatbox.scrollTop = chatbox.scrollHeight;
		},
    onremotetrack: function(track, mid, on) {
      Janus.debug("Remote track (mid=" + mid + ") " + (on ? "added" : "removed") + ":", track);

      if(spinner !== undefined && spinner !== null) {
        spinner.stop();
        spinner = null;
      }

      if(track.kind === "audio") {
        // New audio track: create a stream out of it, and use a hidden <audio> element
        stream.addTrack(track);
        remoteTracks[mid] = stream;
        Janus.log("Created remote audio stream:", stream);

      } else {
        // New video track: create a stream out of it
        remoteVideos++;
				if (remoteVideos > 1) {
					stream.addTrack(track);
					remoteFeed.remoteTracks[mid] = stream;
					Janus.log("Created remote video stream:", stream);
					let localVid = document.getElementById('local_vid');
					localVid.srcObject = stream;
					let localCam = document.getElementById('local_cam');
					localCam.srcObject = screenStream;
				} else {
					screenStream.addTrack(track);
					remoteFeed.remoteTracks[mid] = screenStream;
					Janus.log("Created remote video stream:", screenStream);
					let localVid = document.getElementById('local_vid');
					localVid.srcObject = screenStream;
				}

      }
    }
  })

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
function formatChatMsg(data){
  var msg = JSON.parse(data);
  return "["+msg.time + "] Streamer: "+msg.text;
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
// Sends chat message
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
	// Note: messages are always acknowledged by default. This means that you'll
	// always receive a confirmation back that the message has been received by the
	// server and forwarded to the recipients. If you do not want this to happen,
	// just add an ack:false property to the message above, and server won't send
	// you a response (meaning you just have to hope it succeeded).
	screentest.data({
		text: JSON.stringify(message),
		error: function(reason) { Janus.log(reason); },
		success: function(message) {}
	});
  var msgBox = document.getElementById("msg_box");
  msgBox.value = "";
}


export default WatchLive;
