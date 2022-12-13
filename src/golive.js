import React from 'react';
import {useState, useEffect, useRef} from 'react';
import Janus from './janus'
import './golive.css';
import {Spinner} from 'spin.js';
import {server, iceServers} from './settings'

let camStream = null;
let janusInstance, setJanusInstance, janus;
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
var textroom = null;

let stage = 0;



function GoLive() {
  const [janusInstance, setJanusInstance] = useState(null);

  useEffect(() => {
    getMedia();
    initJanus();
  });

  return (
    <div className="goLive">
    <header className="Live-header">
      <p>
        Going Live Interface
      </p>
			<input type="text" id="codeDisp" value="Room Code"/>
      <table>
        <tr>
          <td>
          <video className="App-video" id="local_vid" autoPlay></video>
          </td>
          <td>
          <table>
          <tr>
          <video className="App-camera" id="local_cam" autoPlay></video>
          </tr>
          <tr>
          <textarea disabled className="chat_window" id = "chat" ></textarea>
          </tr>
          <tr>
          <td>
          <textarea className="new_message" id = "msg_box"></textarea>
          </td>
          <button onClick={sendData}>Send</button>
          <td>
          </td>
          </tr>
          </table>
          </td>
        </tr>
      </table>

      <table>
        <tr>
          <td>
          <button id="cam-mute-button" onClick={muteCam}>Disable Camera</button>
          </td>
          <td>
          <button id="screen-mute-button" onClick={toggleScreenShare}>Enable Screen Share</button>
          </td>
          <td>
          <button onClick={swapScreen}>Swap Screen</button>
          </td>
          <td>
          <button id="mic-mute-button" onClick={muteMic}>Mute Audio</button>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <button onClick={shareScreen}>Go Live</button>
          </td>
          <td>
            <button onClick={stopStream}>Stop Stream</button>
          </td>
        </tr>
      </table>


      </header>
    </div>
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
    localVid.srcObject = new MediaStream([camStream.getVideoTracks()[(camStream.getVideoTracks().length - 1)]]);
    localCam.srcObject = new MediaStream([camStream.getVideoTracks()[0]]);
  }
}

async function swapScreen(){

  console.log(camStream.getVideoTracks().length);
  try {
    if (camStream.getVideoTracks().length > 1) {
      camStream.getVideoTracks()[camStream.getVideoTracks().length - 1].stop();
    }
  } catch (e) {
    console.log(e);
    console.log("no track, continuing");
  }
  screenStream = await navigator.mediaDevices.getDisplayMedia({video:{ mediaSource: "screen" }});
  camStream.addTrack(screenStream.getVideoTracks()[0]);
  console.log(camStream.getVideoTracks().count);
  stage = 1;

	screentest.replaceTracks([
		{
			type:'screen',
			mid: '2',
			capture: camStream.getVideoTracks()[camStream.getVideoTracks().length - 1]
		}
	]);

  startStream()
}

async function stopStream(){
  vidStream = null;
  camStream = null;
  localCam.srcObject = null;
  localVid.srcObject = null;
	janus.destroy();
}
async function muteMic(){
  if(camStream.getAudioTracks()[0].enabled){
    document.getElementById("mic-mute-button").textContent = "Unmute Audio";
    document.getElementById("mic-mute-button").style.background='#800000';
    camStream.getAudioTracks()[0].enabled = false;
  }
  else if(!camStream.getAudioTracks()[0].enabled){
    document.getElementById("mic-mute-button").textContent = "Mute Audio";
    document.getElementById("mic-mute-button").style.background='#FFFFFF';
    camStream.getAudioTracks()[0].enabled = true;
  }
}

async function muteCam(){
  if(camStream.getVideoTracks()[0].enabled){
    document.getElementById("cam-mute-button").textContent = "Enable Camera";
    document.getElementById("cam-mute-button").style.background='#800000';
    camStream.getVideoTracks()[0].enabled = false;
  }
  else if(!camStream.getVideoTracks()[0].enabled){
    document.getElementById("cam-mute-button").textContent = "Disable Camera";
    document.getElementById("cam-mute-button").style.background='#FFFFFF';
    camStream.getVideoTracks()[0].enabled = true;
  }
}

async function toggleScreenShare(){
  if (camStream.getVideoTracks()[1] == null) {
    swapScreen();
  }
  if(stage == 1){
    stage = 0;
    document.getElementById("screen-mute-button").textContent = "Enable Screen Share";
    document.getElementById("screen-mute-button").style.background='#800000';
    camStream.getVideoTracks()[(camStream.getVideoTracks().length - 1)].enabled = false;
    startStream();
  }
  else{
    stage = 1;
    document.getElementById("screen-mute-button").textContent = "Disable Screen Share";
    document.getElementById("screen-mute-button").style.background='#FFFFFF';
    camStream.getVideoTracks()[(camStream.getVideoTracks().length - 1)].enabled = true;
    startStream();
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
              textroom = pluginHandle;
              Janus.log("Plugin attached! (" + screentest.getPlugin() + ", id=" + screentest.getId() + ")");
              // Prepare the username registration
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

                  screentest.createOffer({
                    tracks: [
                      { type: 'audio',  mid:'0', capture: camStream.getAudioTracks()[0], recv: false },
                      { type: 'video',  mid:'1', capture: camStream.getVideoTracks()[0], recv: false },
                      { type: 'screen',  mid:'2', capture: camStream.getVideoTracks()[camStream.getVideoTracks().length - 1], recv: false }
                    ],
                    success: function(jsep) {
                      Janus.debug("Got publisher SDP!", jsep);
                      var publish = { request: "configure", audio: true, video: true };
                      screentest.send({ message: publish, jsep: jsep });
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
              // For WebChat
							if(jsep) {
								Janus.debug("Handling SDP as well...", jsep);
								screentest.handleRemoteJsep({ jsep: jsep });
                  // Answer
                  textroom.createOffer(
                    {
                      jsep: jsep,
                      // We only use datachannels
                      tracks: [
                        { type: 'data' }
                      ],
                      success: function(jsep) {
                        Janus.debug("Got SDP!", jsep);
                        var body = { request: "ack" };
                        textroom.send({ message: body, jsep: jsep });
                      },
                      error: function(error) {
                        Janus.error("WebRTC error:", error);
                      }
                    });
							}
          },
          ondataopen: function(data) {
            Janus.log("The DataChannel is available!");
         
          },
          ondata: function(data) {
            Janus.debug("We got data from the DataChannel!", data);
            //~ $('#datarecv').val(data);
            var json = JSON.parse(data);
            var transaction = json["transaction"];
            if(transactions[transaction]) {
              // Someone was waiting for this
              transactions[transaction](json);
              delete transactions[transaction];
              return;
            }
            var what = json["textroom"];
            if(what === "message") {
              // Incoming message: public or private?
              var msg = escapeXmlTags(json["text"]);
              var from = json["from"];
              var dateString = getDateString(json["date"]);
              var whisper = json["whisper"];
              var sender = participants[from] ? participants[from] : escapeXmlTags(json["display"]);
                // Public message
                var chat = document.getElementById("chat").value;
                Janus.log('<p>[' + dateString + '] <b>' + sender + ':</b> ' + msg);
                //$('#chatroom').get(0).scrollTop = $('#chatroom').get(0).scrollHeight;
              }
             
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


function shareScreen() {
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
		}
	}});
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
 		text: messageText
	};
	// Note: messages are always acknowledged by default. This means that you'll
	// always receive a confirmation back that the message has been received by the
	// server and forwarded to the recipients. If you do not want this to happen,
	// just add an ack:false property to the message above, and server won't send
	// you a response (meaning you just have to hope it succeeded).
	textroom.data({
		text: JSON.stringify(message),
		error: function(reason) { Janus.log(reason); },
		success: function(message) { Janus.log(messageText); }
	});
}
export default GoLive;
