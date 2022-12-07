import React from 'react';
import {useEffect} from 'react';
import './golive.css';

let camStream = null;
let vidStream = null;
let screenStream = null;
let localCam = null;
let localVid = null;
let stage = 0;
let pc1;
let startTime;
const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

function GoLive() {
  useEffect(() => {
    getMedia();
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
        <tr>
          <td>
          <input type ="text" id="title" placeholder="Enter your title here."></input>
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

function getInfo(){
  console.log(camStream.getVideoTracks());
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


function call(){
  console.log('Starting call');
  startTime = window.performance.now();
  const videoTracks = vidStream.getVideoTracks();
  const audioTracks = vidStream.getAudioTracks();
  if (videoTracks.length > 0) {
    console.log(`Using video device: ${videoTracks[0].label}`);
  }
  if (audioTracks.length > 0) {
    console.log(`Using audio device: ${audioTracks[0].label}`);
  }
  const servers = null;
  pc1 = new RTCPeerConnection(servers);
  console.log('Created local peer connection object pc1');
  pc1.onicecandidate = e => onIceCandidate(pc1, e);
  // pc2 = new RTCPeerConnection(servers);
  // console.log('Created remote peer connection object pc2');
  // pc2.onicecandidate = e => onIceCandidate(pc2, e);
  pc1.oniceconnectionstatechange = e => onIceStateChange(pc1, e);
  // pc2.oniceconnectionstatechange = e => onIceStateChange(pc2, e);
  // pc2.ontrack = gotRemoteStream;

  vidStream.getTracks().forEach(track => pc1.addTrack(track, vidStream));
  console.log('Added local stream to pc1');

  console.log('pc1 createOffer start');
  pc1.createOffer(onCreateOfferSuccess, onCreateSessionDescriptionError, offerOptions);
}

function onCreateSessionDescriptionError(error) {
  console.log(`Failed to create session description: ${error.toString()}`);
}

function onCreateOfferSuccess(desc) {
  console.log(`Offer from pc1
${desc.sdp}`);
  console.log('pc1 setLocalDescription start');
  pc1.setLocalDescription(desc, () => onSetLocalSuccess(pc1), onSetSessionDescriptionError);
  // console.log('pc2 setRemoteDescription start');
  // pc2.setRemoteDescription(desc, () => onSetRemoteSuccess(pc2), onSetSessionDescriptionError);
  // console.log('pc2 createAnswer start');
  // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  // pc2.createAnswer(onCreateAnswerSuccess, onCreateSessionDescriptionError);
}
function onSetLocalSuccess(pc) {
  console.log(`pc1 setLocalDescription complete`);
}

function onSetRemoteSuccess(pc) {
  console.log(`pc1 setRemoteDescription complete`);
}

function onSetSessionDescriptionError(error) {
  console.log(`Failed to set session description: ${error.toString()}`);
}

function onIceCandidate(pc, event) {
  pc1.addIceCandidate(event.candidate)
      .then(
          () => onAddIceCandidateSuccess(pc),
          err => onAddIceCandidateError(pc, err)
      );
  console.log(`PC1 ICE candidate:
${event.candidate ?
    event.candidate.candidate : '(null)'}`);
}

function onAddIceCandidateSuccess(pc) {
  console.log(`pc1 addIceCandidate success`);
}

function onAddIceCandidateError(pc, error) {
  console.log(`pc1 failed to add ICE Candidate: ${error.toString()}`);
}

function onIceStateChange(pc, event) {
  if (pc) {
    console.log(`pc1 ICE state: ${pc.iceConnectionState}`);
    console.log('ICE state change event: ', event);
  }
}


export default GoLive;
