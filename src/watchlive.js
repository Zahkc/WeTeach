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

function WatchLive() {
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
          <p>Enter Session ID</p>
          <input type ="text" id="title" placeholder="Enter Session ID"></input>
          <button id="connect">connect</button>
          <button id="disconnect">disconnect</button>
          </td>
        </tr>
      </table>
      </header>
    </div>
  );
}



async function stopStream(){
  vidStream = null
  camStream = null
  localCam.srcObject = null
  localVid.srcObject = null
}



export default WatchLive;
