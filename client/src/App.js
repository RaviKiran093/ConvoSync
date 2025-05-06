import React, { useState } from "react";
import VideoCall from "./VideoCall"; // Placeholder for VideoCall component
import Chat from "./Chat";
import Translate from "./Translate";
import SpeechToText from "./SpeechToText";
import "./App.css";

function App() {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [subtitles, setSubtitles] = useState(""); // Real-time subtitles

  const handleJoinRoom = () => {
    if (roomId.trim() !== "") {
      setJoined(true);
    } else {
      alert("Please enter a valid Room ID.");
    }
  };

  const handleLeaveRoom = () => {
    setJoined(false);
    setRoomId("");
    setSubtitles("");
  };

  return (
    <div className="App">
      <h1>Multilingual Video Call and Chat</h1>
      {!joined ? (
        <div>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          {/* Video Call Component */}
          <VideoCall
            roomId={roomId}
            onSubtitlesUpdate={(text) => {
              setSubtitles(text); // Update real-time subtitles
            }}
          />

          {/* Speech-to-Text Component */}
          <SpeechToText
            onTranscript={(text) => {
              setSubtitles(text); // Update real-time subtitles
            }}
          />

          {/* Chat Component */}
          <Chat roomId={roomId} />

          {/* Subtitles and Translations */}
          <div className="subtitles">
            <h3>Subtitles:</h3>
            <p>{subtitles || "No subtitles yet."}</p>
            <h3>Translated:</h3>
            <p>
              <Translate text={subtitles} />
            </p>
          </div>

          {/* Leave Room Button */}
          <button onClick={handleLeaveRoom}>Leave Room</button>
        </div>
      )}
    </div>
  );
}

export default App;