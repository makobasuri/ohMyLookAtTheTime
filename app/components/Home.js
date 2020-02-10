import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import routes from '../constants/routes.json';
import { Button } from '../components/Button'
import { ipcRenderer } from 'electron'
import styles from './Home.css';
import { Timetracker } from '../components/Timetracker'

const exitApp = () => {
  console.log('clicked')
  ipcRenderer.send('close-window')
}

let initialTimeItems = [];

ipcRenderer.on('saves', (event, message) => console.log(message));

export default class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <h6>ohMyLookAtTheTime</h6>
        <div className="wrapper">
          <Button classes={styles.exit} handleClick={exitApp}>+</Button>
          {/* <Link to={routes.COUNTER}>to Counter</Link>
          <br></br>
          <Link to={routes.TIMETRACKER}>to timetracker</Link> */}
          <Timetracker/>
        </div>
      </React.Fragment>
    );
  }
}
