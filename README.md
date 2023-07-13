
# **react-audio-voice-recorder**
An audio recording helper for React. Provides a component and a hook to help with audio recording.

[![NPM downloads][npm-download-img]][npm-download-url]
[![Run ESlint][eslint-img]][eslint-url]
[![Run Unit tests][test-img]][test-url] 

[npm-download-img]: https://img.shields.io/npm/dm/react-audio-voice-recorder.svg?style=round-square
[npm-download-url]: https://www.npmjs.com/package/react-audio-voice-recorder
[eslint-img]: https://github.com/samhirtarif/react-audio-recorder/actions/workflows/lint.yml/badge.svg
[eslint-url]: https://github.com/samhirtarif/react-audio-recorder/actions/workflows/lint.yml
[test-img]: https://github.com/samhirtarif/react-audio-recorder/actions/workflows/test.yml/badge.svg
[test-url]: https://github.com/samhirtarif/react-audio-recorder/actions/workflows/test.yml

## Installation
```sh
npm install react-audio-voice-recorder
```

```sh
yarn add react-audio-voice-recorder
```

## Migrating from v1 → v2
### Breaking changes
- In v2 the `AudioRecorder` prop `downloadFileExtension` no longer supports `mp3` and `wav` without the website using this package being [cross-origin isolated](https://web.dev/cross-origin-isolation-guide/). This change was made in order to fix [issue #54](https://github.com/samhirtarif/react-audio-recorder/issues/54) in v1.2.1

## Usage

### **AudioRecorder** Component ([See it in action](https://stackblitz.com/edit/react-ts-cc5l47?file=App.tsx))

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
    <AudioRecorder 
      onRecordingComplete={addAudioElement}
      audioTrackConstraints={{
        noiseSuppression: true,
        echoCancellation: true,
      }} 
      downloadOnSavePress={true}
      downloadFileExtension="webm"
    />
  </React.StrictMode>
);
```

| Props  | Description | Default | Optional |
| :------------ |:--------------- |:--------------- | :--------------- |
| **`onRecordingComplete`**  | A method that gets called when "Save recording" option is pressed | N/A | Yes |
| **`audioTrackConstraints`** | Takes a [subset](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings#instance_properties_of_audio_tracks) of `MediaTrackConstraints` that apply to the audio track | N/A | Yes
| **`onNotAllowedOrFound`** | This gets called when the `getUserMedia` promise is rejected. It takes the resultant `DOMException` as its parameter | N/A | Yes
| **`downloadOnSavePress`**  | A `boolean` value that determines if the recording should be downloaded when "Save recording" option is pressed | `false` | Yes |
| **`downloadFileExtension`**  | The file extension to be used for the downloaded file. Allowed values are `webm`, `mp3` and `wav`. In order to use `mp3` or `wav` please ensure that your website is [cross-origin isolated](https://web.dev/cross-origin-isolation-guide/). [Further reading](https://web.dev/coop-coep/) | `webm` | Yes |
| **`showVisualizer`**  | Displays a waveform visualization for the audio when set to `true` | `false` | Yes |
| **`classes`** | This allows class names to be passed to modify the styles for the entire component or specific portions of it | N/A | Yes |

**NOTE: In order for `mp3` and `wav` downloading to work properly, your website needs to be [cross-origin isolated](https://web.dev/cross-origin-isolation-guide/). This is necessary because this package uses [FFmpeg](https://www.npmjs.com/package/@ffmpeg/ffmpeg) which internally uses `SharedArrayBuffer` that requires cross-origin isolation**

---
### **useAudioRecorder** hook

If you prefer to build up your own UI but take advantage of the implementation provided by this package, you can use this hook instead of the component

| Params   | Description | Optional |
| :------------ |:---------------|:---------------|
| **`audioTrackConstraints`** | Takes a [subset](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings#instance_properties_of_audio_tracks) of `MediaTrackConstraints` that apply to the audio track | Yes |
| **`onNotAllowedOrFound`** | This gets called when the `getUserMedia` promise is rejected. It takes the resultant `DOMException` as its parameter | Yes |

The hook returns the following:

| Identifiers   | Description |
| :------------ |:---------------|
| **`startRecording`** | Invoking this method starts the recording. Sets `isRecording` to `true` |
| **`stopRecording`** | Invoking this method stops the recording in progress and the resulting audio is made available in `recordingBlob`. Sets `isRecording` to `false` |
| **`togglePauseResume`** | Invoking this method would pause the recording if it is currently running or resume if it is paused. Toggles the value `isPaused` |
| **`recordingBlob`** | This is the recording blob that is created after `stopRecording` has been called |
| **`isRecording`** | A boolean value that represents whether a recording is currently in progress |
| **`isPaused`** | A boolean value that represents whether a recording in progress is paused |
| **`recordingTime`** | Number of seconds that the recording has gone on. This is updated every second |
| **`mediaRecorder`** | The current mediaRecorder in use. Can be undefined in case recording is not in progress |

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
    mediaRecorder
  } = useAudioRecorder();

  useEffect(() => {
    if (!recordingBlob) return;

    // recordingBlob will be present at this point after 'stopRecording' has been called
  }, [recordingBlob])
```
---
### Combine the **`useAudioRecorder`** hook and the **`AudioRecorder`** component
This is for scenarios where you would wish to control the `AudioRecorder` component from outside the component. You can call the `useAudioRecorder` and pass the object it returns to the **`recorderControls`** of the `AudioRecorder`. This would enable you to control the `AudioRecorder` component from outside the component as well

#### Sample usage ([See it in action](https://stackblitz.com/edit/react-ts-ryj6jz?file=App.tsx))

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

**NOTE: When using both `AudioRecorder` and `useAudioRecorder` in combination, the `audioTrackConstraints` and `onNotAllowedOrFound` should be provided in the `useAudioRecorder` hook**
