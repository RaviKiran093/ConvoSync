import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import SpeechToText from "./SpeechToText";
import Translate from "./Translate";

const socket = io("http://localhost:4000");

const VideoCall = ({ roomId }) => {
  const localVideoRef = useRef(); // Reference for the local video
  const remoteVideoRef = useRef(); // Reference for the remote video
  const peerConnections = useRef({}); // Stores peer connections
  const [transcript, setTranscript] = useState(""); // Captures speech-to-text subtitles
  const [translatedText, setTranslatedText] = useState(""); // Stores translated text

  console.log("Subtitles being passed to Translate:", transcript);

  // Initialize video streaming and WebRTC connections
  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localVideoRef.current.srcObject = stream;

        // Notify server about joining the room
        socket.emit("join-room", roomId);

        // Handle when a new user joins the room
        socket.on("user-joined", async (userId) => {
          const peerConnection = new RTCPeerConnection();
          peerConnections.current[userId] = peerConnection;

          // Add local stream tracks to the peer connection
          stream.getTracks().forEach((track) =>
            peerConnection.addTrack(track, stream)
          );

          // Handle remote stream
          peerConnection.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
          };

          // Create and send an offer
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);

          socket.emit("signal", { to: userId, signal: offer });
        });

        // Handle signaling data
        socket.on("signal", async ({ from, signal }) => {
          const peerConnection =
            peerConnections.current[from] || new RTCPeerConnection();

          peerConnections.current[from] = peerConnection;

          // Handle remote stream
          peerConnection.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
          };

          if (signal.type === "offer") {
            await peerConnection.setRemoteDescription(signal);
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            socket.emit("signal", { to: from, signal: answer });
          } else if (signal.type === "answer") {
            await peerConnection.setRemoteDescription(signal);
          } else if (signal.candidate) {
            await peerConnection.addIceCandidate(signal.candidate);
          }
        });
      } catch (error) {
        console.error("Error accessing user media:", error);
      }
    };

    getUserMedia();

    // Clean up listeners when component unmounts
    return () => {
      socket.off("user-joined");
      socket.off("signal");
    };
  }, [roomId]);

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      {/* Video Elements */}
      <div>
        <video ref={localVideoRef} autoPlay muted style={{ width: "400px", margin: "10px" }} />
        <video ref={remoteVideoRef} autoPlay style={{ width: "400px", margin: "10px" }} />
      </div>

      {/* Speech-to-Text Component */}
      <SpeechToText onTranscript={setTranscript} />

      {/* Translation Component */}
      <Translate
        text={transcript} // Pass the transcript from Speech-to-Text
        targetLanguage="en" // Translate to English (you can change this dynamically)
        onTranslation={setTranslatedText}
      />

      {/* Display Subtitles and Translated Text */}
      <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
        <p><strong>Subtitles:</strong> {transcript}</p>
        <p><strong>Translated:</strong> {translatedText}</p>
      </div>
    </div>
  );
};

export default VideoCall;