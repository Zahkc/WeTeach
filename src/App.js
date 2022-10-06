import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <video className="App-camera" id="local_cam" autoPlay></video>
      <video className="App-video" id="local_vid" autoPlay></video>
        <p>
          React Video Test
        </p>

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

export default App;
