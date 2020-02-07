import React, { useState, useReducer } from 'react'
import { ipcRenderer } from 'electron'
import { Button } from './Button'
import styles from './Timetracker.css'

const getDateNow = () => Math.floor(Date.now() / 1000)

let startTime
let counterInterval
const initialTimeItems = []
const timeItemsReducer = (state, action) => {
  switch(action.type) {
    case 'add': {
      const newState = [...state, action.data]
      ipcRenderer.send('save-data', newState)
      return newState
    }
    case 'modify': {
      const newState = state.map(item => {
        return item.id === action.id
          ? action.data
          : item
      })
      ipcRenderer.send('save-data', newState)
      return newState
    }
  }
}

export const Timetracker = () => {
  const [ timeItems, setTimeItems ] = useReducer(timeItemsReducer, initialTimeItems)
  const [ id, setId ] = useState(0)
  const [ name, setName ] = useState('')
  const [ date, setDate ] = useState('')
  const [ hours, setHours ] = useState('00')
  const [ minutes, setMinutes ] = useState('00')
  const [ seconds, setSeconds ] = useState('00')
  const [ isCounting, setIsCounting ] = useState(false)

  const countTime = () => {
    const now = getDateNow()
    const diff = now - startTime
    const hours = Math.floor(diff / (60 * 60))
    const minutes = Math.floor(diff / 60)
    const seconds = Math.floor(diff % 60)

    setHours(hours < 10 ? '0' + hours : hours)
    setMinutes(minutes < 10 ? '0' + minutes : minutes)
    setSeconds(seconds < 10 ? '0' + seconds : seconds)
    setDate(new Date().toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'}))
  }

  const stopCounter = () => {
    clearInterval(counterInterval)
    startTime = getDateNow()
    setIsCounting(false)
    writeTimeItem()
  }

  const writeTimeItem = () => {
    const sameItem = timeItems.find(item => item.id === id)

    if (timeItems.length < 1 || !sameItem) {
      setTimeItems(
        {
          type: 'add',
          data: {
            id: id,
            name: name,
            date: date,
            hours: hours,
            minutes: minutes,
            seconds: seconds
          }
        }
      )
    } else if (sameItem) {
      setTimeItems(
        {
          type: 'modify',
          id: sameItem.id,
          data: {
            id: id,
            name: name,
            date: date,
            hours: hours,
            minutes: minutes,
            seconds: seconds
          }
        }
      )
    }

  }

  const handleStop = () => {
    setId(id + 1)
    stopCounter()
    setHours('00')
    setMinutes('00')
    setSeconds('00')
    setDate('')
  }

  const handleTracker = event => {
    event.preventDefault()

    if (isCounting) {
      stopCounter()
      return
    }

    startTime = startTime ? startTime : getDateNow()
    counterInterval = setInterval(countTime, 1000)
    setIsCounting(true)
  }

  const onNameChange = event => {
    setName(event.target.value)
  }

  const timerButtonClasses = isCounting
    ? `${styles.timerbutton} ${styles.iscounting}`
    : `${styles.timerbutton}`

  return (
      <React.Fragment>
        <form onSubmit={handleTracker}>
          <input className={styles.input} type="text" placeholder="Whatcha doin?" onChange={onNameChange}/>
          <Button classes={timerButtonClasses} handleClick={handleTracker}>
            <span className={styles.timerclip}>
              <span className={styles.timerclip__bg}></span>
            </span>
          </Button>
          <Button handleClick={handleStop}>
            <span>stop</span>
          </Button>
          <span className={styles.counter}>{hours}:{minutes}:{seconds}</span>
        </form>
        <ul>
          {timeItems.length > 0 ? timeItems.map(item => (
            <li key={item.id}>
              <p>name: {item.name ? item.name : 'TODO: input'} | date: {item.date} | id: {item.id} | time: {item.hours}:{item.minutes}{item.seconds}</p>
            </li>
          )) : ''}
        </ul>
      </React.Fragment>
  )
}
