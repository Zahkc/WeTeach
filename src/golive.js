import React from 'react';
import {useState, useEffect} from 'react';
import './golive.css';
import Janus from './janus'

let camStream = null;
let vidStream = null;
let screenStream = null;
let localCam = null;
let localVid = null;
let stage = 0;
let janusInstance;
let setJanusInstance;
var server =  "https://weteach.ddns.net:8089/janus";

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
          <textarea disabled className="chat_window" ></textarea>
          </tr>
          <tr>
          <td>
          <textarea className="new_message"></textarea>
          </td>
          <button>Send</button>
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
            <button onClick={getInfo}>Go Live</button>
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

function initJanus(){

    Janus.init({debug: "all", callback: function() {
        if(!Janus.isWebrtcSupported()) {
    console.log("No WebRTC support... ");
    return;
        }

        const janus = new Janus(
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
        // Attach to echo test plugin
                    console.log("Janus loaded");
                    setJanusInstance(janus);
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
  startStream()
}

async function stopStream(){
  vidStream = null
  camStream = null
  localCam.srcObject = null
  localVid.srcObject = null
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

export default GoLive;
