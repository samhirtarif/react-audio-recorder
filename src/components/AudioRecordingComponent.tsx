import React, { useState, useEffect, ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faTrash,
  faPause,
  faSave,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

import useAudioRecorder, { recorderControls } from "../hooks/useAudioRecorder";

import "../styles/audio-recorder.css";

interface Props {
  /**
   * This gets called when the save button is clicked.
   * In case the recording is cancelled, the blob is discarded.
   **/
  onRecordingComplete?: (blob: Blob) => void;
  /**
   * Allows calling of hook outside this component. The controls returned by the hook can then be passed to the component using this prop.
   * This allows for use of hook methods and state outside this component
   **/
  recorderControls?: recorderControls
}

const AudioRecorder: (props: Props) => ReactElement = ({
  onRecordingComplete,
  recorderControls,
}: Props) => {
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
  } = recorderControls || useAudioRecorder();
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
      className={`audio-recorder ${isRecording ? "recording" : ""}`}
      data-testid="audio_recorder"
    >
      <FontAwesomeIcon
        icon={isRecording ? faSave : faMicrophone}
        className="audio-recorder-mic"
        onClick={isRecording ? () => stopAudioRecorder() : startRecording}
        data-testid="ar_mic"
        title={isRecording ? "Save recording" : "Start recording"}
      />
      <span
        className={`audio-recorder-timer ${!isRecording ? "display-none" : ""}`}
        data-testid="ar_timer"
      >
        {Math.floor(recordingTime / 60)}:
        {String(recordingTime % 60).padStart(2, "0")}
      </span>
      <span
        className={`audio-recorder-status ${
          !isRecording ? "display-none" : ""
        }`}
      >
        <span className="audio-recorder-status-dot"></span>
        Recording
      </span>
      <FontAwesomeIcon
        icon={isPaused ? faPlay : faPause}
        className={`audio-recorder-options ${
          !isRecording ? "display-none" : ""
        }`}
        onClick={togglePauseResume}
        title={isPaused ? "Resume recording" : "Pause recording"}
        data-testid="ar_pause"
      />
      <FontAwesomeIcon
        icon={faTrash}
        className={`audio-recorder-options ${
          !isRecording ? "display-none" : ""
        }`}
        onClick={() => stopAudioRecorder(false)}
        title="Cancel Recording"
        data-testid="ar_cancel"
      />
    </div>
  );
};

export default AudioRecorder;
