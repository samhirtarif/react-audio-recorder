
# **react-audio-recorder**
An audio recording helper for React. Provides a component and a hook to help with audio recording.

## Installation
```sh
npm install react-audio-recorder
```

## Usage

### **AudioRecorder** Component

You can use an out-of-the-box component that takes `onRecordingComplete` function as a prop and calls it when you save the recording

```js
import React from "react";
import ReactDOM from "react-dom/client";
import AudioRecorder from "react-audio-recorder";

const addAudioElement = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const audio = document.createElement("audio");
  audio.src = url;
  audio.controls = true;
  document.body.appendChild(audio);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AudioRecorder onRecordingComplete={addAudioElement} />
  </React.StrictMode>
);
```


### **useAudioRecorder** hook

If you prefer to build up your own UI but take advantage of the implementation provided by this package, you can use this hook instead of the component

The hook returns the following:

#### **`startRecording`**
Calling this function would result in the recording to start. Sets `isRecording` to `true`


#### **`stopRecording`**
This results in a recording in progress being stopped and the resulting audio being present in `recordingBlob`. Sets `isRecording` to `false`


#### **`togglePauseResume`**
Calling this function would pause the recording if it is currently running or resume if it is paused. Toggles the value `isPaused`


#### **`recordingBlob`**
This is the recording blob that is created after `stopRecording` has been called


#### **`isRecording`**
A boolean value that represents whether a recording is currently in progress


#### **`isPaused`**
A boolean value that represents whether a recording in progress is paused


#### **`recordingTime`**
Number of seconds that the recording has gone on. This is updated every second

### Sample usage of hook

```js
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
  } = useAudioRecorder();
```