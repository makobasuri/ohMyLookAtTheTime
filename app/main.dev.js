/* eslint global-require: off */

import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import electron from 'electron'
import { autoUpdater } from 'electron-updater';
import path from 'path'
import fs from 'fs'
import log from 'electron-log'
import parse from 'csv-parse/lib/sync'

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const parseDataFile = filePath => {
  try {
    return JSON.parse(fs.readFileSync(filePath))
  } catch (error) {
    console.log(error)
    return 'error'
  }
}

const parseCSVFile = data => {
  try {
    return parse(data, {columns: true, delimiter: ';'})
  } catch (error) {
    console.log(error)
    return 'error'
  }
}

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 728,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    },
    backgroundColor: '#1f1f1f'
  });

  const userDataPath = (app || electron.remote.app).getPath('userData')
  const filePath = path.join(userDataPath, 'data.json')
  const projectsFilePath = path.join(userDataPath, 'projects.json')

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    // send saved data, if any
    if (fs.existsSync(filePath)) {
      mainWindow.webContents.send('saves', parseDataFile(filePath))
    }
    if (fs.existsSync(projectsFilePath)) {
      mainWindow.webContents.send('projectsData', parseDataFile(projectsFilePath))
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // save data
  ipcMain.on('save-data', (event, arg) => {
    console.log('saving data to: ', filePath)

    fs.writeFileSync(filePath, JSON.stringify(arg, null, 2))
  })

  ipcMain.on('save-name', (event, arg) => {
    const savedData = JSON.parse(fs.readFileSync(filePath))

    if (savedData.filter(datapoint => datapoint.id === arg.id).length > 0) {

      fs.writeFileSync(filePath, JSON.stringify(
        savedData.map(dataPoint => {
          if (dataPoint.id == arg.id) {
            dataPoint.name = arg.value
          }

          return dataPoint
        }),
        null,
        2
      ))
    }

    // console.log(savedData, arg.value, arg.id)
  })

  ipcMain.on('reset', () => {
    fs.writeFileSync(filePath, '[]')
    mainWindow.reload()
  })

  ipcMain.on('open-file', () => {
    dialog.showOpenDialog(mainWindow, {
      properties: ['openFile']
    }).then(result => {
      if (result.filePaths[0]) {
        const csvData = parseCSVFile(fs.readFileSync(result.filePaths[0], 'latin1'))
        const openProjects = csvData.filter(project => project.Status === 'Offen')
        const relevantProjects = openProjects.map(project => ({
          name: project.Projekt,
          task: project.Aufgabe
        }))

        fs.writeFileSync(projectsFilePath, JSON.stringify(relevantProjects, null, 2))
        mainWindow.webContents.send('projectsData', relevantProjects)
      }

    }).catch(err => console.log(err))
  })

  ipcMain.on('close-window', (event, arg) => {
    app.quit()
  })

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
