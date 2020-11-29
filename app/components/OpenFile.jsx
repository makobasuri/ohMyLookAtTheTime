import React from 'react'
import {ipcRenderer} from 'electron'

export const OpenFile = () => {

  const openFile = () => {
    ipcRenderer.send('open-file')
  };

  return (
    <button className="absolute bottom-0 right-0 outline-none border-0 m-4 p-1 bg-white text-black leading-none cursor-pointer" onClick={openFile}>Open File</button>
  )
}
