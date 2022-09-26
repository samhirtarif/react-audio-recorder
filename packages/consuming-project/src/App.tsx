import { useState } from 'react'
import { AudioRecorder } from 'react-audio-voice-recorder'

function App() {

  return (
    <div>
      <AudioRecorder onRecordingComplete={() => console.log("Done")}/>
    </div>
  )
}

export default App
