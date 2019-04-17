/**
 * THE CALCULATOR
 * 
 * @file app.js
 * @brief Entry point and Electron settings
 * @author Jan Svabik (xsvabi00)
 * @version 1.0
 */

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

// init main window
let mainWindow;

const createWindow = () => {
    // create a new instance of window and set it up
    mainWindow = new BrowserWindow({
        width: 600,
        height: 350,
        resizable: false,
        icon: __dirname + '/img/icon.png',
    });

    // display calc.html page as the calculator GUI
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'calc.html'),
        protocol: 'file:',
        slashes: true,
    }));

    // reset mainWindow when the window is closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

// create the main window when app is ready
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform === 'darwin')
        app.quit();
});