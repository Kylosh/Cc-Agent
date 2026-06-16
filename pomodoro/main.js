const { app, BrowserWindow, Notification, ipcMain, nativeTheme } = require('electron');
const path = require('path');

nativeTheme.themeSource = 'dark';

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 700,
    resizable: false,
    titleBarStyle: 'hiddenInset',
    frame: false,
    backgroundColor: '#1a1a2e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

ipcMain.on('notify', (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
});

ipcMain.on('window-close', () => app.quit());
ipcMain.on('window-minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
