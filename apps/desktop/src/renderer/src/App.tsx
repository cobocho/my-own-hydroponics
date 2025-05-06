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
      <Button>Click me</Button>
    </div>
  )
}

export default App
