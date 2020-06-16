import React, { useState } from 'react'
import styles from './Timetrackerlist.css'
import {Button} from './Button'
import timerStyles from './Timetracker.css'
import {TimetrackerInput} from './TimetrackerInput'

export const TimetrackerList = ({timeItems, onChangeTimeItem, onContinueTimeToday}) => {

  const timeParts = [...new Set([...timeItems.map(timeItem => `${timeItem.date} ${timeItem.day}`)])]
  const filledTimeParts = timeParts.map(part => ({[part]: timeItems.filter(timeItem => `${timeItem.date} ${timeItem.day}` === part)}))

  console.log(filledTimeParts)

  const timerButtonClasses = `${timerStyles.timerbutton} ${styles.timerbutton}`
  const timerclip__bgClasses = `${timerStyles.timerclip__bg} ${styles.timerclip__bg}`

  return (
    <ul>
      {filledTimeParts.length > 0 ? filledTimeParts.map((part, index) => {
        const partName = Object.keys(part)[0]
        return (
        <li className={styles.outerlist__part} key={index}>
          <h4 className={styles.outerlist__title}>{partName}</h4>
          <ul>
            {part[partName].map(item => (
              <li key={item.id}>
                <TimetrackerInput name={item.name} id={item.id} onChange={onChangeTimeItem} />
                <div></div>
                <div className={styles.timerbuttonwrapper}>
                  <Button classes={timerButtonClasses} type="button" handleClick={() => onContinueTimeToday(item.name)}>
                    <span className={timerStyles.timerclip}>
                      <span className={timerclip__bgClasses}></span>
                    </span>
                  </Button>
                </div>
                <p className={styles.textright}>{item.hours}:{item.minutes}:{item.seconds}</p>
              </li>
            ))}
          </ul>
        </li>
      )}) : ''}
    </ul>
  )
}
