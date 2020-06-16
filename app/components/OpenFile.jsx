import React, {useState} from 'react'
import {ipcRenderer} from 'electron'

export const OpenFile = () => {

  const openFile = () => {
    ipcRenderer.send('open-file')
  };

  return (
    <button style={{position: 'absolute', bottom: '20px', right: '20px'}} onClick={openFile}>Open File</button>
  )
}
