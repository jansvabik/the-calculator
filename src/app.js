/**
 * The entry point of the app and Electron settings
 * @module app
 * @author Jan Svabik (xsvabi00)
 * @version 1.0
 */

/**
 * The app controller from the Electron package
 * @constant
 */
const app = require('electron').app;

/**
 * The external interface coming from Electron. BrowserWindow is the constructor for managing the native windows in OS.
 * @interface
 * @summary Interface for managing native windows in the OS.
 * @author GitHub, Inc.
 * @author other contributors
 * @since 0.1
 * @see https://electronjs.org/docs/api/browser-window
 * @license MIT
 */
const BrowserWindow = require('electron').BrowserWindow;

/**
 * path package for path manipulations
 * @constant
 */
const path = require('path');

/**
 * url package for url manipulations
 * @constant
 */
const url = require('url');

/**
 * Main window initializer
 * @type {BrowserWindow}
 */
let mainWindow;

/**
 * Function for creating the main window. This function will be called when the electron app will be ready to start.
 */
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

// quit the app when all windows are closed
app.on('window-all-closed', () => {
    //if (process.platform === 'darwin')
        app.quit();
});