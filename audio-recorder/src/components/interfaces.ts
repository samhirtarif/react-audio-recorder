import { recorderControls } from "../hooks/useAudioRecorder";

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
   * Allows calling of hook outside this component. The controls returned by the hook can then be passed to the component using this prop.
   * This allows for use of hook methods and state outside this component
   * @sample_usage https://github.com/samhirtarif/react-audio-recorder#combine-the-useaudiorecorder-hook-and-the-audiorecorder-component
   **/
  recorderControls?: recorderControls;
  /**
   * Custom classes to changes styles.
   **/
  classes?: StyleProps;
}
