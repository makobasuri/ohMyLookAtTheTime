import React from 'react'
import { ipcRenderer } from 'electron'

export const TimeResetter = () => {

  const reset = () => {
    ipcRenderer.send('reset')
  };

  return (
    <button className="absolute bottom-0 left-0 outline-none border-0 m-4 p-1 bg-white text-black leading-none cursor-pointer" onClick={reset}>Reset All</button>
  )
}
