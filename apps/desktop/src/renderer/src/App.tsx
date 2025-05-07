import { useEffect, useState } from 'react'
import { Button } from '@my-own-hydroponics/ui'

import { SensorData } from './types/sensor'

function App() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null)

  useEffect(() => {
    window.api.onReceiveSensorData((data) => {
      setSensorData(data)
    })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="">temperature: {sensorData?.temperature}</p>
      <p>humidity: {sensorData?.humidity}</p>
      <p>water: {sensorData?.water}</p>
      <Button
        onClick={() => {
          window.api.setLightData({ r: 255, g: 0, b: 0, brightness: 50 })
        }}
      >
        Light Red
      </Button>
      <Button
        onClick={() => {
          window.api.setLightData({ r: 0, g: 255, b: 0, brightness: 50 })
        }}
      >
        Light Green
      </Button>
      <Button
        onClick={() => {
          window.api.setLightData({ r: 0, g: 0, b: 255, brightness: 50 })
        }}
      >
        Light Blue
      </Button>
      <Button
        onClick={() => {
          window.api.setLightData({ r: 255, g: 0, b: 255, brightness: 50 })
        }}
      >
        Light White
      </Button>
      <Button
        onClick={() => {
          window.api.setLightData({ r: 0, g: 0, b: 0, brightness: 0 })
        }}
      >
        Light Off
      </Button>
    </div>
  )
}

export default App
