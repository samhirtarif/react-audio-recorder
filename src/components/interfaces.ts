import {
  MediaAudioTrackConstraints,
  recorderControls,
} from "../hooks/useAudioRecorder";

interface StyleProps {
  /**
   * Applies passed classes to audio recorder container
   **/
  AudioRecorderClass?: string;
  /**
   * Applies passed classes to audio recorder start/save option
   **/
  AudioRecorderStartSaveClass?: string;
  /**
   * Applies passed classes to audio recorder timer
   **/
  AudioRecorderTimerClass?: string;
  /**
   * Applies passed classes to audio recorder status option
   **/
  AudioRecorderStatusClass?: string;
  /**
   * Applies passed classes to audio recorder pause/resume option
   **/
  AudioRecorderPauseResumeClass?: string;
  /**
   * Applies passed classes to audio recorder discard option
   **/
  AudioRecorderDiscardClass?: string;
}

export interface Props {
  /**
   * This gets called when the save button is clicked.
   * In case the recording is cancelled, the blob is discarded.
   **/
  onRecordingComplete?: (blob: Blob) => void;
  /**
   * This gets called when the getUserMedia Promise is rejected.
   * It takes the resultant DOMException as its parameter.
   **/
  onNotAllowedOrFound?: (exception: DOMException) => any;
  /**
   * Allows calling of hook outside this component. The controls returned by the hook can then be passed to the component using this prop.
   * This allows for use of hook methods and state outside this component
   * @sample_usage https://github.com/samhirtarif/react-audio-recorder#combine-the-useaudiorecorder-hook-and-the-audiorecorder-component
   **/
  recorderControls?: recorderControls;
  /**
   * Takes a {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings#instance_properties_of_audio_tracks subset} of
   * `MediaTrackConstraints` that apply to the audio track
   *
   * @Property `deviceId`
   * @Property `groupId`
   * @Property `autoGainControl`
   * @Property `channelCount`
   * @Property `echoCancellation`
   * @Property `noiseSuppression`
   * @Property `sampleRate`
   * @Property `sampleSize`
   */
  audioTrackConstraints?: MediaAudioTrackConstraints;
  /**
   * If set to `true` the file gets downloaded when save recording is pressed
   **/
  downloadOnSavePress?: boolean;
  /**
   * File extension for the audio filed that gets downloaded
   **/
  downloadFileExtension?: "mp3" | "wav" | "webm";
  /**
   * Displays a waveform visualization for the audio when set to `true`. Defaults to `false`
   **/
  showVisualizer?: boolean;
  /**
   * Custom classes to changes styles.
   **/
  classes?: StyleProps;
}
