import { faStream } from "@fortawesome/free-solid-svg-icons";
import { useState, useCallback } from "react";

const useAudioRecorder: () => {
    startRecording: () => void;
    stopRecording: () => void;
    togglePauseResume: () => void;
    recordingBlob?: Blob;
    isRecording: boolean;
    isPaused: boolean;
    recordingTime: Array<number>
 } = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState([0,0])
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>()
    const [timerInterval, setTimerInterval] = useState<number | null>()
    const [recordingBlob, setRecordingBlob] = useState<Blob>()

    const startRecording = useCallback(() => {
        if (timerInterval) return;

        setIsRecording(true)
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const recorder: MediaRecorder = new MediaRecorder(stream)
                setMediaRecorder(recorder);
                recorder.start();
                const interval = setInterval(() => {
                    if (recorder?.state === "recording") {
                        setRecordingTime(prevTime => ([
                            prevTime[1] === 59 ? prevTime[0] + 1 : prevTime[0],
                            prevTime[1] === 59 ? 0 : prevTime[1] + 1
                        ]))
                    }
                }, 1000)
                setTimerInterval(interval)

                recorder.ondataavailable = (event) =>{ 
                    setRecordingBlob(event.data)
                }
            });
    }, [])

    const stopRecording = () => {
        mediaRecorder?.stop();
        timerInterval && clearInterval(timerInterval)
        setTimerInterval(null)
        setMediaRecorder(null)
        setRecordingTime([0, 0]) 
        setIsRecording(false)
        setIsPaused(false)
    }

    const togglePauseResume = () => {
        if (isPaused) {
            setIsPaused(false)
            mediaRecorder?.resume()
        } else {
            setIsPaused(true)
            mediaRecorder?.pause()
        }
    }

    return { startRecording, stopRecording, togglePauseResume, recordingBlob, isRecording, isPaused, recordingTime }
}

export default useAudioRecorder