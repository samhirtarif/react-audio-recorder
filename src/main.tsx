import React from "react";
import ReactDOM from "react-dom/client";
import AudioRecorder from "./components/AudioRecordingComponent";
import AudioVisualizerComponent from "./components/AudioVisualizerComponent";
import useAudioRecorder from "./hooks/useAudioRecorder";

// TODO
// Add doc strings
// Improve UI

const addAudioElement = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const audio = document.createElement("audio");
  audio.src = url;
  audio.controls = true;
  document.body.appendChild(audio);
};

const Visualized = () => {
  const {
    startRecording,
    stopRecording,
    isRecording,
    mediaStream,
    mediaRecorder
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useAudioRecorder();

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop recording" : "Start recording"}
      </button>
      {mediaRecorder && mediaStream  &&
        <AudioVisualizerComponent stream={mediaStream} recorder={mediaRecorder} />
      }
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AudioRecorder onRecordingComplete={(blob) => addAudioElement(blob)} showVisualizer={true}/>
    <br />
    <br />
    <Visualized />
  </React.StrictMode>
);
