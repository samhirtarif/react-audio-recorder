import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import AudioRecorder from "./AudioRecordingComponent";

const definition: ComponentMeta<typeof AudioRecorder> = {
  title: "AudioRecorder",
  component: AudioRecorder,
};

const onRecordingComplete: (blob: Blob) => void = (blob: Blob) => {
  alert("Save pressed. On recording complete called with blob");
};

export const Primary: ComponentStory<typeof AudioRecorder> = () => (
  <AudioRecorder onRecordingComplete={onRecordingComplete} />
);

export default definition;
