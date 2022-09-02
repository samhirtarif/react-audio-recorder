import { useState, useCallback } from "react";

const useAudioRecorder: () => {
  startRecording: () => void;
  stopRecording: () => void;
  togglePauseResume: () => void;
  recordingBlob?: Blob;
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
} = () => {
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

  const stopRecording: () => void = () => {
    mediaRecorder?.stop();
    _stopTimer();
    setMediaRecorder(null);
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
  };

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
