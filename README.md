
# **react-audio-voice-recorder**
An audio recording helper for React. Provides a component and a hook to help with audio recording.

## Installation
```sh
npm install react-audio-voice-recorder
```

## Usage

### **AudioRecorder** Component ([Usage](https://stackblitz.com/edit/react-ts-cc5l47?file=App.tsx))

You can use an out-of-the-box component that takes `onRecordingComplete` method as a prop and calls it when you save the recording

```js
import React from "react";
import ReactDOM from "react-dom/client";
import { AudioRecorder } from 'react-audio-voice-recorder';

const addAudioElement = (blob) => {
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

The component also takes a `classes` as a prop, allowing you to modify the styles for the entire component or specific portions of it.

---
### **useAudioRecorder** hook

If you prefer to build up your own UI but take advantage of the implementation provided by this package, you can use this hook instead of the component

The hook returns the following:

#### **`startRecording`**
Calling this method would result in the recording to start. Sets `isRecording` to `true`


#### **`stopRecording`**
This results in a recording in progress being stopped and the resulting audio being present in `recordingBlob`. Sets `isRecording` to `false`


#### **`togglePauseResume`**
Calling this method would pause the recording if it is currently running or resume if it is paused. Toggles the value `isPaused`


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
  import { useAudioRecorder } from 'react-audio-voice-recorder';
  // ...
  // ...
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
---
### Combine the **`useAudioRecorder`** hook and the **`AudioRecorder`** component
This is for scenarios where you would wish to control the `AudioRecorder` component from outside the component. You can call the `useAudioRecorder` and pass the object it returns to the **`recorderControls`** of the `AudioRecorder`. This would enable you to control the `AudioRecorder` component from outside the component as well

#### Sample usage ([Working example](https://stackblitz.com/edit/react-ts-ryj6jz?file=App.tsx))

```js
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

const ExampleComponent = () => {
  const recorderControls = useAudioRecorder()
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  };

  return (
    <div>
      <AudioRecorder 
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
      />
      <button onClick={recorderControls.stopRecording}>Stop recording</button>
    </div>
  )
}
```
