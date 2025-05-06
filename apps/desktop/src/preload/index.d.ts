import { ElectronAPI } from '@electron-toolkit/preload'

import { SensorData } from '../main/serial'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getSensorData: () => Promise<SensorData>
      onReceiveSensorData: (callback: (data: SensorData) => void) => void
    }
  }
}
