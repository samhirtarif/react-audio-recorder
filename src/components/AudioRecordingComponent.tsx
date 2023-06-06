import React, { useState, useEffect, ReactElement } from "react";
import { Props } from "./interfaces";
import useAudioRecorder from "../hooks/useAudioRecorder";
import { LiveAudioVisualizer } from "react-audio-visualize";

import micSVG from "../icons/mic.svg";
import pauseSVG from "../icons/pause.svg";
import resumeSVG from "../icons/play.svg";
import saveSVG from "../icons/save.svg";
import discardSVG from "../icons/stop.svg";
import "../styles/audio-recorder.css";

/**
 * Usage: https://github.com/samhirtarif/react-audio-recorder#audiorecorder-component
 *
 *
 * @prop `onRecordingComplete` Method that gets called when save recording option is clicked
 * @prop `recorderControls` Externally initilize hook and pass the returned object to this param, this gives your control over the component from outside the component.
 * https://github.com/samhirtarif/react-audio-recorder#combine-the-useaudiorecorder-hook-and-the-audiorecorder-component
 * @prop `audioTrackConstraints`: Takes a {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings#instance_properties_of_audio_tracks subset} of `MediaTrackConstraints` that apply to the audio track
 * @prop `onNotAllowedOrFound`: A method that gets called when the getUserMedia promise is rejected. It receives the DOMException as its input.
 * @prop `downloadOnSavePress` If set to `true` the file gets downloaded when save recording is pressed. Defaults to `false`
 * @prop `downloadFileExtension` File extension for the audio filed that gets downloaded. Defaults to `mp3`. Allowed values are `mp3`, `wav` and `webm`
 * @prop `showVisualizer` Displays a waveform visualization for the audio when set to `true`. Defaults to `false`
 * @prop `classes` Is an object with attributes representing classes for different parts of the component
 */
const AudioRecorder: (props: Props) => ReactElement = ({
  onRecordingComplete,
  onNotAllowedOrFound,
  recorderControls,
  audioTrackConstraints,
  downloadOnSavePress = false,
  downloadFileExtension = "mp3",
  showVisualizer = false,
  classes,
}: Props) => {
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } =
    recorderControls ??
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAudioRecorder(audioTrackConstraints, onNotAllowedOrFound);

  const [shouldSave, setShouldSave] = useState(false);

  const stopAudioRecorder: (save?: boolean) => void = (
    save: boolean = true
  ) => {
    setShouldSave(save);
    stopRecording();
  };

  const downloadBlob = (blob: Blob): void => {
    const downloadBlob = new Blob([blob], {
      type: `audio/${downloadFileExtension}`,
    });
    const url = URL.createObjectURL(downloadBlob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `audio.${downloadFileExtension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  useEffect(() => {
    if (
      (shouldSave || recorderControls) &&
      recordingBlob != null &&
      onRecordingComplete != null
    ) {
      onRecordingComplete(recordingBlob);
      if (downloadOnSavePress) {
        downloadBlob(recordingBlob);
      }
    }
  }, [recordingBlob]);

  return (
    <div
      className={`audio-recorder ${isRecording ? "recording" : ""} ${
        classes?.AudioRecorderClass ?? ""
      }`}
      data-testid="audio_recorder"
    >
      <img
        src={isRecording ? saveSVG : micSVG}
        className={`audio-recorder-mic ${
          classes?.AudioRecorderStartSaveClass ?? ""
        }`}
        onClick={isRecording ? () => stopAudioRecorder() : startRecording}
        data-testid="ar_mic"
        title={isRecording ? "Save recording" : "Start recording"}
      />
      <span
        className={`audio-recorder-timer ${
          !isRecording ? "display-none" : ""
        } ${classes?.AudioRecorderTimerClass ?? ""}`}
        data-testid="ar_timer"
      >
        {Math.floor(recordingTime / 60)}:
        {String(recordingTime % 60).padStart(2, "0")}
      </span>
      {showVisualizer ? (
        <span
          className={`audio-recorder-visualizer ${
            !isRecording ? "display-none" : ""
          }`}
        >
          {mediaRecorder && (
            <LiveAudioVisualizer
              mediaRecorder={mediaRecorder}
              barWidth={2}
              gap={2}
              width={140}
              height={30}
              fftSize={512}
              maxDecibels={-10}
              minDecibels={-80}
              smoothingTimeConstant={0.4}
            />
          )}
        </span>
      ) : (
        <span
          className={`audio-recorder-status ${
            !isRecording ? "display-none" : ""
          } ${classes?.AudioRecorderStatusClass ?? ""}`}
        >
          <span className="audio-recorder-status-dot"></span>
          Recording
        </span>
      )}
      <img
        src={isPaused ? resumeSVG : pauseSVG}
        className={`audio-recorder-options ${
          !isRecording ? "display-none" : ""
        } ${classes?.AudioRecorderPauseResumeClass ?? ""}`}
        onClick={togglePauseResume}
        title={isPaused ? "Resume recording" : "Pause recording"}
        data-testid="ar_pause"
      />
      <img
        src={discardSVG}
        className={`audio-recorder-options ${
          !isRecording ? "display-none" : ""
        } ${classes?.AudioRecorderDiscardClass ?? ""}`}
        onClick={() => stopAudioRecorder(false)}
        title="Discard Recording"
        data-testid="ar_cancel"
      />
    </div>
  );
};

export default AudioRecorder;
