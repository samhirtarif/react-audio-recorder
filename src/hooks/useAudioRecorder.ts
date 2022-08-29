import { useState, useCallback } from "react";

const useAudioRecorder: () => {
  startRecording: () => void;
  stopRecording: () => void;
  togglePauseResume: () => void;
  recordingBlob?: Blob;
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number[];
} = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState([0, 0]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>();
  const [timerInterval, setTimerInterval] = useState<number>(0);
  const [recordingBlob, setRecordingBlob] = useState<Blob>();

  const startRecording: () => void = useCallback(() => {
    if (timerInterval > 0) return;

    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder: MediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.start();
        const interval = setInterval(() => {
          if (!isPaused) {
            setRecordingTime((prevTime) => [
              prevTime[1] === 59 ? prevTime[0] + 1 : prevTime[0],
              prevTime[1] === 59 ? 0 : prevTime[1] + 1,
            ]);
          }
        }, 1000);
        setTimerInterval(interval);

        recorder.ondataavailable = (event) => {
          setRecordingBlob(event.data);
        };
      })
      .catch(() => console.log("Could not get user media"));
  }, [timerInterval]);

  const stopRecording: () => void = () => {
    mediaRecorder?.stop();
    timerInterval > 0 && clearInterval(timerInterval);
    setTimerInterval(0);
    setMediaRecorder(null);
    setRecordingTime([0, 0]);
    setIsRecording(false);
    setIsPaused(false);
  };

  const togglePauseResume: () => void = () => {
    if (isPaused) {
      setIsPaused(false);
      mediaRecorder?.resume();
    } else {
      setIsPaused(true);
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
