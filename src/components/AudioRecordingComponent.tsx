import React, { useState, useEffect, ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faTrash,
  faPause,
  faSave,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { Props } from "./interfaces";
import useAudioRecorder from "../hooks/useAudioRecorder";

import "../styles/audio-recorder.css";

/**
 * Usage: https://github.com/samhirtarif/react-audio-recorder#audiorecorder-component
 *
 *
 * @param onRecordingComplete Method that gets called when save recording option is clicked
 * @param recorderControls Externally initilize hook and pass the returned object to this param, this gives your control over the component from outside the component.
 * https://github.com/samhirtarif/react-audio-recorder#combine-the-useaudiorecorder-hook-and-the-audiorecorder-component
 *
 */
const AudioRecorder: (props: Props) => ReactElement = ({
  onRecordingComplete,
  recorderControls,
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = recorderControls ?? useAudioRecorder();
  const [shouldSave, setShouldSave] = useState(false);

  const stopAudioRecorder: (save?: boolean) => void = (
    save: boolean = true
  ) => {
    setShouldSave(save);
    stopRecording();
  };

  useEffect(() => {
    if (shouldSave && recordingBlob != null && onRecordingComplete != null) {
      onRecordingComplete(recordingBlob);
    }
  }, [recordingBlob]);

  return (
    <div
      className={`audio-recorder ${isRecording ? "recording" : ""} ${
        classes?.AudioRecorderClass ?? ""
      }`}
      data-testid="audio_recorder"
    >
      <FontAwesomeIcon
        icon={isRecording ? faSave : faMicrophone}
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
      <span
        className={`audio-recorder-status ${
          !isRecording ? "display-none" : ""
        } ${classes?.AudioRecorderStatusClass ?? ""}`}
      >
        <span className="audio-recorder-status-dot"></span>
        Recording
      </span>
      <FontAwesomeIcon
        icon={isPaused ? faPlay : faPause}
        className={`audio-recorder-options ${
          !isRecording ? "display-none" : ""
        } ${classes?.AudioRecorderPauseResumeClass ?? ""}`}
        onClick={togglePauseResume}
        title={isPaused ? "Resume recording" : "Pause recording"}
        data-testid="ar_pause"
      />
      <FontAwesomeIcon
        icon={faTrash}
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
