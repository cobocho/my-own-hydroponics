/* eslint-disable promise/prefer-await-to-callbacks */
import { ipcMain } from 'electron'
import { SerialPort, ReadlineParser } from 'serialport'

export interface SensorData {
  temperature: number
  humidity: number
  water: number
}

export interface LightData {
  r: number
  g: number
  b: number
  brightness: number
}

class GlobalStore {
  private sensorData: SensorData = {
    temperature: 0,
    humidity: 0,
    water: 0,
  }

  private lightData: LightData = {
    r: 0,
    g: 0,
    b: 0,
    brightness: 0,
  }

  public getSensorData(): SensorData {
    return this.sensorData
  }

  public setSensorData(sensorData: SensorData): void {
    this.sensorData = sensorData
  }

  public getLightData(): LightData {
    return this.lightData
  }

  public setLightData(lightData: LightData): void {
    this.lightData = lightData
  }
}

export const globalStore = new GlobalStore()

export const openSerialPort = (onReceive?: (data: SensorData) => void) => {
  const port = new SerialPort({
    path: '/dev/tty.SLAB_USBtoUART',
    baudRate: 115200,
    autoOpen: false, // 수동으로 열기
  })

  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))
  let isPortReady = false

  port.open((err) => {
    if (err) {
      console.error('❌ Failed to open serial port:', err.message)
    } else {
      isPortReady = true
      console.log('✅ Serial port opened')
    }
  })

  parser.on('data', (data: string) => {
    try {
      console.log('🪵 from arduino:', data)

      const json = JSON.parse(data) as SensorData
      globalStore.setSensorData(json)
      onReceive?.(json)
    } catch {
      // console.error('❌ JSON parse error:', data)
    }
  })

  // 시리얼 → 프론트 데이터 요청 핸들러
  ipcMain.handle('getSensorData', () => {
    return globalStore.getSensorData()
  })

  ipcMain.handle('getLightData', () => {
    return globalStore.getLightData()
  })

  ipcMain.handle('setLightData', (_event, data: LightData) => {
    globalStore.setLightData(data)
    const json = JSON.stringify(data)

    if (!isPortReady) {
      console.warn('⚠️ 포트가 아직 열리지 않았습니다. write() 무시됨')
      return
    }

    port.write(json + '\n', (err) => {
      if (err) {
        console.error('❌ Serial write failed:', err)
      }
    })
  })
}
