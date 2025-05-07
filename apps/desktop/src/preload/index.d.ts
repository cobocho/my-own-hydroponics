import { ElectronAPI } from '@electron-toolkit/preload'

import { LightData, SensorData } from '../main/serial'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getSensorData: () => Promise<SensorData>
      onReceiveSensorData: (callback: (data: SensorData) => void) => void
      getLightData: () => Promise<LightData>
      setLightData: (data: LightData) => Promise<void>
    }
  }
}
