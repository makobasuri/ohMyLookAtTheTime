import React, { useState } from 'react'

import { Timetracker } from '../Timetracker/Timetracker'

export const TimetrackerList = () => {
  const [trackedItems, setTracked] = useState()

  const onTrackedItemUpdate = itemData => {
    setTracked(trackedItems.map(item => {
      if (item.id === id) {
        return { ...item, hours: item.hours, minutes: item.minutes, seconds: item.seconds, name: item.name }
      } else {
        return item
      }
    }))
  }

  return (
    <React.Fragment>
      <Timetracker />
      <ul>

      </ul>
    </React.Fragment>
  )
}
