import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import routes from '../constants/routes.json';
import { Button } from './Button'
import { ipcRenderer } from 'electron'
import { Timetracker } from './Timetracker'

const exitApp = () => {
  console.log('clicked')
  ipcRenderer.send('close-window')
}

export default class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <h1 className="m-4 text-base font-normal leading-none">ohMyLookAtTheTime</h1>
        <div className="p-4">
          <Button classes="absolute top-0 right-0 outline-none border-0 block m-1 p-0 w-8 h-8 text-4xl font-thin leading-none transform rotate-45 origin-center cursor-pointer"
            handleClick={exitApp}>+</Button>
          {/* <Link to={routes.COUNTER}>to Counter</Link>
          <br></br>
          <Link to={routes.TIMETRACKER}>to timetracker</Link> */}
          <Timetracker/>
        </div>
      </React.Fragment>
    );
  }
}
