import React, { useState } from 'react'
import styles from './Timetrackerlist.css'

export const TimetrackerList = props => {
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

  console.log(props.timeItems)

  return (
    <ul>
      {props.timeItems.length > 0 ? props.timeItems.map(item => (
        <li key={item.id}>
          <p>{item.name ? item.name : 'TODO: input'}</p>
          <div><p className={styles.date}>{item.day}</p><p className={styles.date}>{item.date}</p></div>
          <p>{item.hours}:{item.minutes}:{item.seconds}</p>
        </li>
      )) : ''}
    </ul>
  )
}
