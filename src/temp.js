import React, { Fragment } from 'react';

function Temp(){
	return(
		<Fragment>

		</Fragment>
	)
}

function startLiveStreamWithChatroom(streamId, roomId) {
  // Initialize Janus WebRTC
  Janus.init({debug: "all", callback: function() {
    // Create a new Janus session
    var janus = new Janus({
      server: "your_janus_server_url",
      success: function() {
        // Create a new Janus plugin handle for the video room
        janus.attach({
          plugin: "janus.plugin.videoroom",
          success: function(pluginHandle) {
            // Join the video room with the given room ID
            var joinOptions = {room: roomId, ptype: "publisher"};
            pluginHandle.send({message: {request: "join", ...joinOptions}});

            // Get the user's media stream and attach it to the video room
            Janus.getUserMedia({
              audio: true,
              video: true,
              success: function(mediaStream) {
                Janus.attachMediaStream($("#myvideo").get(0), mediaStream);
                pluginHandle.createOffer({
                  media: {stream: mediaStream},
                  success: function(jsep) {
                    pluginHandle.send({
                      message: {request: "configure", audio: true, video: true},
                      jsep: jsep
                    });
                  }
                });
              }
            });

            // Create a new Janus plugin handle for the chat room
            janus.attach({
              plugin: "janus.plugin.textroom",
              success: function(chatHandle) {
                // Join the chat room with the given room ID and user ID
                var userId = Math.floor(Math.random() * 1000000);
                var joinOptions = {room: roomId, username: userId};
                chatHandle.send({message: {request: "join", ...joinOptions}});

                // Set up event listeners for incoming chat messages
                chatHandle.onmessage = function(msg, jsep) {
                  if (msg["text"]) {
                    // Display the incoming chat message in the chatroom
                    var sender = msg["from"];
                    var message = msg["text"];
                    $("#chatroom").append("<p>" + sender + ": " + message + "</p>");
                  }
                }

                // Set up event listener for outgoing chat messages
                $("#chatinput").keydown(function(event) {
                  if (event.keyCode === 13) {
                    // Send the chat message when the user presses Enter
                    var message = $("#chatinput").val();
                    chatHandle.data({
                      text: message,
                      room: roomId,
                      to: userId
                    });
                    $("#chatinput").val("");
                  }
                });
              }
            });
          }
        });
      }
    });
  }});
}

export default Temp;
