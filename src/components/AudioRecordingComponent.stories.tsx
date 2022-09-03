import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import AudioRecorder from './AudioRecordingComponent';

export default {
  title: 'AudioRecorder',
  component: AudioRecorder,
} as ComponentMeta<typeof AudioRecorder>;

const onRecordingComplete = (blob: Blob) => {
  alert("Save pressed. On recording complete called with blob");
}

export const Primary: ComponentStory<typeof AudioRecorder> = () => <AudioRecorder onRecordingComplete={onRecordingComplete}/>;
