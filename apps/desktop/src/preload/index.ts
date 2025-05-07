/* eslint-disable promise/prefer-await-to-callbacks */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { LightData, SensorData } from '../main/serial'

const api = {
  getSensorData: async () => {
    const data = (await ipcRenderer.invoke('getSensorData')) as SensorData
    return data
  },
  onReceiveSensorData: (callback: (data: SensorData) => void) => {
    ipcRenderer.on('receiveSensorData', (_, data: SensorData) => {
      callback(data)
    })
  },
  getLightData: async () => {
    const data = (await ipcRenderer.invoke('getLightData')) as LightData
    return data
  },
  setLightData: async (data: LightData) => {
    await ipcRenderer.invoke('setLightData', data)
  },
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI
  // @ts-expect-error (define in dts)
  window.api = api
}
