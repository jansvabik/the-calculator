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
        icon: path.join(__dirname + 'build/icon.png'),
        webPreferences: {
            nativeWindowOpen: true,
        },
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

    // opening modals (e.g. common root input)
    mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
        // open window as modal
        if (frameName === 'modal') {
            event.preventDefault();
            Object.assign(options, {
                parent: mainWindow,
                modal: true,
                width: 300,
                height: 170,
            });

            // use BrowserWindow to create the new window
            event.newGuest = new BrowserWindow(options);
        }
      });
};

// create the main window when app is ready
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform === 'darwin')
        app.quit();
});