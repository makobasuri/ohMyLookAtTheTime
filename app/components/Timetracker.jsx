import React, { useState, useReducer, useEffect } from 'react'
import useInterval from './useInterval'
import { ipcRenderer } from 'electron'
import { Button } from './Button'
import styles from './Timetracker.css'
import {TimetrackerList} from './TimetrackerList'
import {TimeResetter} from './TimeResetter'
import {OpenFile} from './OpenFile'

const getDateNow = () => Math.floor(Date.now() / 1000)

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
  const [ startTime, setStartTime ] = useState(0)
  const [ id, setId ] = useState(0)
  const [ name, setName ] = useState('')
  const [ date, setDate ] = useState('')
  const [ day, setDay ] = useState('')
  const [ projects, setProjects ] = useState([])
  const [ project, setProject ] = useState('')
  const [ hours, setHours ] = useState('00')
  const [ minutes, setMinutes ] = useState('00')
  const [ seconds, setSeconds ] = useState('00')
  const [ isCounting, setIsCounting ] = useState(false)
  const [ delay, setDelay ] = useState(1000);

  useInterval(() => {
    countTime()
  }, isCounting ? delay : null)

  useEffect(() => {
    ipcRenderer.on('saves', (event, message) => {
      if (message.length > 0 && message !== 'error') {
        console.log('onSaves', message, message.length);
        setId(message.length);
        message.forEach(messageItem => setTimeItems({
          type: 'add',
          data: messageItem
        }))
      }
    });

    ipcRenderer.on('projectsData', (event, projects) => {
      setProjects(projects)
    })
  })

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
    setDay(new Date().toLocaleString('de-DE', {weekday: 'long'}))
  }

  const stopCounter = () => {
    setStartTime(getDateNow())
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
            project: project,
            date: date,
            day: day,
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
            project: project,
            date: date,
            day: day,
            hours: hours,
            minutes: minutes,
            seconds: seconds
          }
        }
      )
    }
  }

  const handleNew = () => {
    if ((id) < timeItems.length) {
      setId(timeItems.length + 1)
    } else {
      setId(id + 1)
    }
    stopCounter()
    setStartTime(0)
    setHours('00')
    setMinutes('00')
    setSeconds('00')
    setName('')
    setDate('')
    setDay('')
    setProject('')
  }

  const handleTracker = (event, skipCheck) => {
    if (event) {
      event.preventDefault()
    }

    if (!skipCheck && isCounting) {
      stopCounter()
      return
    }
    console.log(startTime)

    setStartTime(startTime > 0 ? startTime : getDateNow())
    setIsCounting(true)
  }

  const onNameChange = nameOrEvent => {
    setName(nameOrEvent.target ? nameOrEvent.target.value : nameOrEvent)
  }

  const onSetProject = event => {
    setProject(event.target.value)
  }

  const continueTimeToday = (newName) => {
    if (isCounting && newName === name) {
      return
    }

    if (isCounting) {
      handleNew()
      setName(newName)
      setTimeout(() => {
        handleTracker(false, true)
      }, 2000)
      return
    }

    console.log('not counting', id, timeItems.length)

    onNameChange(newName)
    handleTracker()
  }

  const changeTimeItem = item => {
    setTimeItems(
      {
        type: 'modify',
        id: item.id,
        data: {
          id: item.id,
          name: item.name,
          project: item.project,
          date: item.date,
          day: item.day,
          hours: item.hours,
          minutes: item.minutes,
          seconds: item.seconds
        }
      }
    )
  }

  const timerButtonClasses = isCounting
    ? `${styles.timerbutton} ${styles.iscounting}`
    : `${styles.timerbutton}`

  return (
      <React.Fragment>
        <form onSubmit={handleTracker}>
          <div>
            <input className={'input'} type="text" placeholder="Whatcha doin?" value={name} onChange={onNameChange}/>
            <select value={project} onChange={onSetProject}>
                <option></option>
              {projects.length > 0 ? projects.map((currProj, index) => (
                <option key={index} value={`${currProj.name} -- ${currProj.task}`}>{currProj.name} -- {currProj.task}</option>
              )) : ''}
            </select>
          </div>
          <Button classes={timerButtonClasses} type="button" handleClick={handleTracker}>
            <span className={styles.timerclip}>
              <span className={styles.timerclip__bg}></span>
            </span>
          </Button>
          <Button type="button" handleClick={handleNew}>
            <span>new</span>
          </Button>
          <span className={styles.counter}>{hours}:{minutes}:{seconds}</span>
        </form>
        <TimetrackerList
          timeItems={timeItems}
          onContinueTimeToday={continueTimeToday}
          onChangeTimeItem={changeTimeItem}
        />
        <TimeResetter />
        <OpenFile />
      </React.Fragment>
  )
}
