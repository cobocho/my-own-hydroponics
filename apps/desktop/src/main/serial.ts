import { ipcMain } from 'electron'
import { SerialPort, ReadlineParser } from 'serialport'

export interface SensorData {
  temperature: number
  humidity: number
  water: number
}

class GlobalStore {
  private sensorData: SensorData = {
    temperature: 0,
    humidity: 0,
    water: 0,
  }

  public constructor() {
    this.sensorData = {
      temperature: 0,
      humidity: 0,
      water: 0,
    }
  }

  public getSensorData(): SensorData {
    return this.sensorData
  }

  public setSensorData(sensorData: SensorData): void {
    this.sensorData = sensorData
  }
}

export const globalStore = new GlobalStore()

export const openSerialPort = (onReceive?: (data: SensorData) => void) => {
  const port = new SerialPort({
    path: '/dev/tty.SLAB_USBtoUART',
    baudRate: 115200,
  })

  ipcMain.handle('getSensorData', () => {
    return globalStore.getSensorData()
  })

  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

  port.on('open', () => {
    console.log('open')
  })

  parser.on('data', (data: string) => {
    try {
      const json = JSON.parse(data) as SensorData
      onReceive?.(json)
    } catch {
      console.error('json parse error', data)
    }
  })
}
