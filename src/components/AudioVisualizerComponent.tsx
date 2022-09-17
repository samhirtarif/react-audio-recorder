import React, { ReactElement, useCallback, useEffect, useState } from "react"
import { VisualizerProps } from "./interfaces"

const Bar = ({height}: {height: number}) => {
  return (
    <div className="visualizer-bar" style={{height}}>
    </div>
  )
}

const AudioVisualizerComponent: (props: VisualizerProps) => ReactElement = ({
  recorder,
  stream,
  resizeRatio = 1,
}: VisualizerProps) => {
  const [context] = useState(() => new AudioContext());
  const [analyser, setAnalyser] = useState<AnalyserNode>()
  const [data, setData] = useState<Uint8Array>()

  useEffect(() => {
    if (!stream) return;

    const tempAnalyser = context.createAnalyser()
    tempAnalyser.fftSize = 64
    tempAnalyser.maxDecibels = 1;
    const source = context.createMediaStreamSource(stream)
    setAnalyser(tempAnalyser)

    setData(new Uint8Array(tempAnalyser.frequencyBinCount))
    source.connect(tempAnalyser)
  }, [stream])
  
  useEffect(() => {
    if (analyser || recorder.state === "recording") report()
  }, [analyser, recorder.state])

  const report = useCallback(() => {
    if (!analyser) return

    const tempData = new Uint8Array(analyser?.frequencyBinCount)
    

    if (recorder && recorder.state === "recording") {
      analyser?.getByteFrequencyData(tempData)
      setData(tempData)
      requestAnimationFrame(report)
    } else if (recorder.state === "paused") {
      setData(tempData)
    } else if (recorder.state === "inactive" && context.state !== "closed") {
      context.close()
    }
  }, [analyser])

  return (
    <div className="audio-visualizer">
      { data && 
        Array.from(data).map((dp, i) => <Bar key={i} height={dp === 0 ? 2 : dp * resizeRatio} />)
      }
    </div>
  )
}

export default AudioVisualizerComponent