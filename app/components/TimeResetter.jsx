import React, {useState} from 'react'
import {ipcRenderer} from 'electron'

export const TimeResetter = () => {

  const reset = () => {
    ipcRenderer.send('reset')
  };

  return (
    <button style={{position: 'absolute', bottom: '20px'}} onClick={reset}>Reset All</button>
  )
}
