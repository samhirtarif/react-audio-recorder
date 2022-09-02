import React, { useTransition } from "react";
import { expect, test, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AudioRecorder from "../src/components/AudioRecordingComponent";

const mockGetUserMedia = vi.fn(async () => {
  return new Promise<void>(resolve => {
      resolve()
  })
})

Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
      getUserMedia: mockGetUserMedia,
  },
})

let dataavailableCallback: any = null
const addEventListener = vi.fn().mockImplementation((event, cb) => {
  // holding on to the callback assigned by useAudioRecorder hook to call later from MediaRecorder.stop
  dataavailableCallback = cb;
})

Object.defineProperty(window, 'MediaRecorder', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
      start: vi.fn(),
      addEventListener: addEventListener,
      onerror: vi.fn(),
      state: '',
      stop: vi.fn().mockImplementation(() => {
        // calling the addEventListener callback added by useAudioRecorder
        dataavailableCallback && dataavailableCallback({
          data: new Blob([JSON.stringify({ a: 1 }, null, 2)], {type : 'application/json'})
        })
      }),
      pause: vi.fn()
  }))
});

describe("Test AudioRecorder", () => {
  test("AudioRecorder renders", () => {
    render(<AudioRecorder />)
    expect(screen.getByTestId("audio_recorder")).toHaveClass("audio-recorder")
  });

  
  test("AudioRecorder starts / cancels properly", async () => {
    const user = userEvent.setup()
    render(<AudioRecorder />)
    const audioRecorder: HTMLElement = screen.getByTestId("audio_recorder");
    const audioRecorderMic: HTMLElement = screen.getByTestId("ar_mic")
    await user.click(audioRecorderMic)
    expect(audioRecorder).toHaveClass("recording")

    const audioRecorderCanel: HTMLElement = screen.getByTestId("ar_cancel")
    await user.click(audioRecorderCanel)

    expect(audioRecorder.classList.contains("recording")).toBeFalsy()
  });


  test("AudioRecorder starts / save properly", async () => {
    const user = userEvent.setup()
    const onRecordingComplete = vi.fn()
    render(<AudioRecorder onRecordingComplete={onRecordingComplete} />)
    const audioRecorder: HTMLElement = screen.getByTestId("audio_recorder");
    const audioRecorderMic: HTMLElement = screen.getByTestId("ar_mic")
    await user.click(audioRecorderMic)
    expect(audioRecorder).toHaveClass("recording")

    await user.click(audioRecorderMic)
    expect(audioRecorder.classList.contains("recording")).toBeFalsy()
    expect(onRecordingComplete).toHaveBeenCalled()
  });


  test("AudioRecorder starts / pause / save properly", async () => {
    const user = userEvent.setup()
    const onRecordingComplete = vi.fn()
    render(<AudioRecorder onRecordingComplete={onRecordingComplete} />)
    const audioRecorder: HTMLElement = screen.getByTestId("audio_recorder");
    const audioRecorderMic: HTMLElement = screen.getByTestId("ar_mic")
    await act(() => user.click(audioRecorderMic))
    expect(audioRecorder).toHaveClass("recording")
    
    const audioRecorderPause: HTMLElement = screen.getByTestId("ar_pause")
    const audioRecorderTimer: HTMLElement = screen.getByTestId("ar_timer")
    await act(() => user.click(audioRecorderPause))
    const time = audioRecorderTimer.textContent;

    await new Promise(res => setTimeout(async () => {
      expect(audioRecorder).toHaveClass("recording") //should still be recording after pause      
      expect(audioRecorderTimer.textContent).toEqual(time) //timer should have have stayed the same after 1 second
  
      await user.click(audioRecorderMic)
      expect(audioRecorder.classList.contains("recording")).toBeFalsy()
      expect(onRecordingComplete).toHaveBeenCalled()
      res(1);
    }, 1000))
  });


  test("AudioRecorder timer works properly", async () => {
    const user = userEvent.setup()
    const onRecordingComplete = vi.fn()
    render(<AudioRecorder onRecordingComplete={onRecordingComplete} />)
    const audioRecorder: HTMLElement = screen.getByTestId("audio_recorder");
    const audioRecorderMic: HTMLElement = screen.getByTestId("ar_mic")
    await act(() => user.click(audioRecorderMic))
    expect(audioRecorder).toHaveClass("recording")
    
  
    await new Promise(res => setTimeout(async () => {
      const audioRecorderTimer: HTMLElement = screen.getByTestId("ar_timer")
      expect(audioRecorder).toHaveClass("recording") //should still be recording after pause      
      expect(audioRecorderTimer.textContent).toEqual("0:01") //timer should have gone to 1 sec
  
      await user.click(audioRecorderMic)
      expect(audioRecorder.classList.contains("recording")).toBeFalsy()
      expect(onRecordingComplete).toHaveBeenCalled()
      res(1);
    }, 1000))
  });
})
