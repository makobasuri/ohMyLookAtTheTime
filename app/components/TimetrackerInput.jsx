import React, {useState} from 'react'
import {ipcRenderer} from 'electron'

export const TimetrackerInput = props => {
  const [name, setName] = useState(props.name)

  const onNameChange = (event) => {
    setName(event.target.value)
    ipcRenderer.send('save-name', {
      value: event.target.value,
      id: props.id
    })
    console.log(event.target.value, props.id)
  }

  return (
    <input
      className={'input'}
      type="text"
      placeholder="Add name"
      onChange={(event) => onNameChange(event)}
      value={name}
    />
  )
}
