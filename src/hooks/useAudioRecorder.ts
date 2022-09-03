import { useState, useCallback } from "react";

export interface recorderControls {
  startRecording: () => void;
  stopRecording: () => void;
  togglePauseResume: () => void;
  recordingBlob?: Blob;
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
}

/**
 * @returns Controls for the recording. Details of returned controls are given below
 *
 * @details `startRecording`: Calling this method would result in the recording to start. Sets `isRecording` to true
 * @details `stopRecording`: This results in a recording in progress being stopped and the resulting audio being present in `recordingBlob`. Sets `isRecording` to false
 * @details `togglePauseResume`: Calling this method would pause the recording if it is currently running or resume if it is paused. Toggles the value `isPaused`
 * @details `recordingBlob`: This is the recording blob that is created after `stopRecording` has been called
 * @details `isRecording`: A boolean value that represents whether a recording is currently in progress
 * @details `isPaused`: A boolean value that represents whether a recording in progress is paused
 * @details `recordingTime`: Number of seconds that the recording has gone on. This is updated every second
 */
const useAudioRecorder: () => recorderControls = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>();
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer>();
  const [recordingBlob, setRecordingBlob] = useState<Blob>();

  const _startTimer: () => void = () => {
    const interval = setInterval(() => {
      setRecordingTime((time) => time + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const _stopTimer: () => void = () => {
    timerInterval != null && clearInterval(timerInterval);
    setTimerInterval(undefined);
  };

  /**
   * Calling this method would result in the recording to start. Sets `isRecording` to true
   */
  const startRecording: () => void = useCallback(() => {
    if (timerInterval != null) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setIsRecording(true);
        const recorder: MediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.start();
        _startTimer();

        recorder.addEventListener("dataavailable", (event) => {
          setRecordingBlob(event.data);
        });
      })
      .catch((err) => console.log(err));
  }, [timerInterval]);

  /**
   * Calling this method results in a recording in progress being stopped and the resulting audio being present in `recordingBlob`. Sets `isRecording` to false
   */
  const stopRecording: () => void = () => {
    mediaRecorder?.stop();
    _stopTimer();
    setMediaRecorder(null);
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
  };

  /**
   * Calling this method would pause the recording if it is currently running or resume if it is paused. Toggles the value `isPaused`
   */
  const togglePauseResume: () => void = () => {
    if (isPaused) {
      setIsPaused(false);
      mediaRecorder?.resume();
      _startTimer();
    } else {
      setIsPaused(true);
      _stopTimer();
      mediaRecorder?.pause();
    }
  };

  return {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
  };
};

export default useAudioRecorder;
