import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
    <header className="App-header">
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
          <button onClick={getMedia}>Get Media</button>
          </td>
          <td>
          <button onClick={swapScreen}>Swap Screen</button>
          </td>
          <td>
          <button onClick={stopStream}>Stop Screen</button>
          </td>
        </tr>
      </table>


      </header>
    </div>
  );
}
let camStream = null;
let vidStream = null;
let localCam = null;
let localVid = null;
let pc1;
let startTime;
const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

async function getMedia(){
  localCam = document.getElementById('local_cam');
  localVid = document.getElementById('local_vid');
  camStream = await navigator.mediaDevices.getUserMedia({
         video: { mediaSource: "camera" },
         audio: true
       });
  vidStream = await navigator.mediaDevices.getDisplayMedia({
         video: { mediaSource: "screen" },
         audio: false
       });
  startStream()
}

async function startStream(){
  localCam.srcObject = camStream
  localVid.srcObject = vidStream
}

async function swapScreen(){
  vidStream = await navigator.mediaDevices.getDisplayMedia({
         video: { mediaSource: "screen" },
         audio: false
       });
  startStream()
}

async function stopStream(){
  vidStream = null
  camStream = null
  localCam.srcObject = null
  localVid.srcObject = null
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


export default App;
