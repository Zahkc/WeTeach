import React from 'react';
import {useState, useEffect, useRef} from 'react';
import Janus from './janus'
import './golive.css';
import {Spinner} from 'spin.js';
import {server, iceServers} from './settings'

let stream = new MediaStream([])
let janusInstance, setJanusInstance, janus;
var opaqueId = "screensharingtest-"+Janus.randomString(12);
var screentest, room, role, myid, source, spinner, roomid;
var localTracks = {}, localVideos = 0,
	remoteTracks = {}, remoteVideos = 0;
var myusername = Janus.randomString(12);


function WatchLive() {
  const inputRef = useRef(null);

  function handleClick(){
    room = inputRef.current.value;
    newRemoteFeed();
  }

  console.log(server)
  const [janusInstance, setJanusInstance] = useState(null);
  useEffect(() => {
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
        <tr>
          <td>
          <p>Enter Session ID</p>
          <input type="text" ref={inputRef} id="title" placeholder="Enter Session ID"></input>
          <button onClick={attemptConnect} id="connect">connect</button>
          <button id="disconnect">disconnect</button>
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

function attemptConnect(){
  room = parseInt("1580264379752557");
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
        stream.addTrack(track);
        remoteFeed.remoteTracks[mid] = stream;
        Janus.log("Created remote video stream:", stream);
        let localVid = document.getElementById('local_vid');
        localVid.srcObject = stream;
        console.log("test")
        console.log(stream);
        console.log("test")
      }
    }
  })

}





































export default WatchLive;
