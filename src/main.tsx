import React from "react";
import ReactDOM from "react-dom/client";
import AudioRecorder from "./components/AudioRecordingComponent";

const addAudioElement = (blob: Blob) => {
  console.log("addAudioElement");
  const url = URL.createObjectURL(blob);
  const bodyElement = document.getElementsByTagName("body")[0];
  const audio = document.createElement("audio");
  audio.src = url;
  audio.controls = true;
  bodyElement.appendChild(audio);
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AudioRecorder onRecordingComplete={(blob) => addAudioElement(blob)} />
  </React.StrictMode>
);
