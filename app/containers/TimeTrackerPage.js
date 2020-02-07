import React, { Component } from 'react';
import { Button } from '../components/Button'
import { ipcRenderer } from 'electron'
import { Timetracker } from '../components/Timetracker'

const exitApp = () => {
  console.log('clicked')
  ipcRenderer.send('close-window')
}

export default class TimeTrackerPage extends Component {
    render() {
      return (
        <React.Fragment>
          <Button handleClick={exitApp}>+</Button>
          <Timetracker />
        </React.Fragment>
      );
    }
}
