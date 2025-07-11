const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
const win = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false, // Good practice
    sandbox: false           // 👈 MUST be false to use native modules in preload
  }
});

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
