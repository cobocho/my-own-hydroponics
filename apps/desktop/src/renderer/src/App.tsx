import { useEffect, useState } from 'react'

import { SensorData } from './types/sensor'

function App() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null)

  useEffect(() => {
    window.api.onReceiveSensorData((data) => {
      setSensorData(data)
    })
  }, [])

  return (
    <div>
      <p>temperature: {sensorData?.temperature}</p>
      <p>humidity: {sensorData?.humidity}</p>
      <p>water: {sensorData?.water}</p>
    </div>
  )
}

export default App
