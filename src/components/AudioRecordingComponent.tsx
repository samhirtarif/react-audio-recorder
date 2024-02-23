import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { Props } from "./interfaces";
import useAudioRecorder from "../hooks/useAudioRecorder";

import micSVG from "../icons/mic.svg";
import pauseSVG from "../icons/pause.svg";
import resumeSVG from "../icons/play.svg";
import saveSVG from "../icons/save.svg";
import discardSVG from "../icons/trash.svg";
import "../styles/audio-recorder.css";

const LiveAudioVisualizer = React.lazy(async () => {
  const { LiveAudioVisualizer } = await import("react-audio-visualize");
  return { default: LiveAudioVisualizer };
});

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
  downloadFileExtension = "webm",
  showVisualizer = false,
  mediaRecorderOptions,
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
    useAudioRecorder(
      audioTrackConstraints,
      onNotAllowedOrFound,
      mediaRecorderOptions
    );

  const [shouldSave, setShouldSave] = useState(false);

  const stopAudioRecorder: (save?: boolean) => void = (
    save: boolean = true
  ) => {
    setShouldSave(save);
    stopRecording();
  };

  const startAudioRecorder: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    startRecording();
    const target = event.target as HTMLElement;
    target?.focus();
  };

  const convertToDownloadFileExtension = async (
    webmBlob: Blob
  ): Promise<Blob> => {
    const FFmpeg = await import("@ffmpeg/ffmpeg");
    const ffmpeg = FFmpeg.createFFmpeg({ log: false });
    await ffmpeg.load();

    const inputName = "input.webm";
    const outputName = `output.${downloadFileExtension}`;

    ffmpeg.FS(
      "writeFile",
      inputName,
      new Uint8Array(await webmBlob.arrayBuffer())
    );

    await ffmpeg.run("-i", inputName, outputName);

    const outputData = ffmpeg.FS("readFile", outputName);
    const outputBlob = new Blob([outputData.buffer], {
      type: `audio/${downloadFileExtension}`,
    });

    return outputBlob;
  };

  const downloadBlob = async (blob: Blob): Promise<void> => {
    if (!crossOriginIsolated && downloadFileExtension !== "webm") {
      console.warn(
        `This website is not "cross-origin isolated". Audio will be downloaded in webm format, since mp3/wav encoding requires cross origin isolation. Please visit https://web.dev/cross-origin-isolation-guide/ and https://web.dev/coop-coep/ for information on how to make your website "cross-origin isolated"`
      );
    }

    const downloadBlob = crossOriginIsolated
      ? await convertToDownloadFileExtension(blob)
      : blob;
    const fileExt = crossOriginIsolated ? downloadFileExtension : "webm";
    const url = URL.createObjectURL(downloadBlob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `audio.${fileExt}`;
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
        void downloadBlob(recordingBlob);
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
      <button
        className={`audio-recorder-mic ${
          classes?.AudioRecorderStartSaveClass ?? ""
        }`}
        data-testid="ar_mic"
        aria-label={isRecording ? "Save recording" : "Start recording"}
        title={isRecording ? "Save recording" : "Start recording"}
        onClick={isRecording ? () => stopAudioRecorder() : startAudioRecorder}
      >
        <img
          src={isRecording ? saveSVG : micSVG}
          alt={isRecording ? "Save recording" : "Start recording"}
          width={16}
          height={16}
        />
      </button>
      <span
        role="timer"
        aria-atomic="true"
        hidden={!isRecording}
        aria-hidden={!isRecording ? "true" : "false"}
        className={`audio-recorder-timer ${
          classes?.AudioRecorderTimerClass ?? ""
        }`}
        data-testid="ar_timer"
      >
        {Math.floor(recordingTime / 60)}:
        {String(recordingTime % 60).padStart(2, "0")}
      </span>
      {showVisualizer ? (
        <span
          hidden={!isRecording}
          aria-hidden={!isRecording ? "true" : "false"}
          className="audio-recorder-visualizer"
        >
          {mediaRecorder && (
            <Suspense fallback={<></>}>
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
            </Suspense>
          )}
        </span>
      ) : (
        <span
          hidden={!isRecording}
          aria-hidden={!isRecording ? "true" : "false"}
          className={`audio-recorder-status ${
            classes?.AudioRecorderStatusClass ?? ""
          }`}
        >
          <span className="audio-recorder-status-dot"></span>
          Recording
        </span>
      )}
      <button
        hidden={!isRecording}
        aria-hidden={!isRecording ? "true" : "false"}
        tabIndex={!isRecording ? -1 : 0}
        className={`audio-recorder-options ${
          classes?.AudioRecorderPauseResumeClass ?? ""
        }`}
        onClick={togglePauseResume}
        aria-label={isPaused ? "Resume recording" : "Pause recording"}
        title={isPaused ? "Resume recording" : "Pause recording"}
        data-testid={"ar_pause"}
      >
        <img
          src={isPaused ? resumeSVG : pauseSVG}
          alt={isPaused ? "Resume recording" : "Pause recording"}
          width={16}
          height={16}
        />
      </button>
      <button
        hidden={!isRecording}
        aria-hidden={!isRecording ? "true" : "false"}
        tabIndex={!isRecording ? -1 : 0}
        className={`audio-recorder-options ${
          classes?.AudioRecorderDiscardClass ?? ""
        }`}
        onClick={() => stopAudioRecorder(false)}
        aria-label="Discard Recording"
        title="Discard Recording"
        data-testid="ar_cancel"
      >
        <img src={discardSVG} width={16} height={16} alt="Discard Recording" />
      </button>
    </div>
  );
};

export default AudioRecorder;
