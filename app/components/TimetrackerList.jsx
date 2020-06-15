import React, { useState } from 'react'
import styles from './Timetrackerlist.css'
import {Button} from './Button'
import timerStyles from './Timetracker.css'
import {TimetrackerInput} from './TimetrackerInput'

export const TimetrackerList = ({timeItems, onContinueTimeToday}) => {
  // const [trackedItems, setTracked] = useState()

  // const onTrackedItemUpdate = itemData => {
  //   setTracked(trackedItems.map(item => {
  //     if (item.id === id) {
  //       return { ...item, hours: item.hours, minutes: item.minutes, seconds: item.seconds, name: item.name }
  //     } else {
  //       return item
  //     }
  //   }))
  // }

  const timerButtonClasses = `${timerStyles.timerbutton} ${styles.timerbutton}`
  const timerclip__bgClasses = `${timerStyles.timerclip__bg} ${styles.timerclip__bg}`

  return (
    <ul>
      {timeItems.length > 0 ? timeItems.map(item => (
        <li key={item.id}>
          <TimetrackerInput name={item.name} id={item.id}/>
          <div><p className={styles.date}>{item.day}</p><p className={styles.date}>{item.date}</p></div>
          <div className={styles.timerbuttonwrapper}>
            <Button classes={timerButtonClasses} type="button" handleClick={(event) => onContinueTimeToday(item.name)}>
              <span className={timerStyles.timerclip}>
                <span className={timerclip__bgClasses}></span>
              </span>
            </Button>
          </div>
          <p className={styles.textright}>{item.hours}:{item.minutes}:{item.seconds}</p>
        </li>
      )) : ''}
    </ul>
  )
}
