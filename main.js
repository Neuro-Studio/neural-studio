const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#02040a',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webBluetooth: true,
    },
  });

  win.webContents.session.setPermissionRequestHandler((wc, permission, cb) => {
    cb(permission === 'bluetooth' || permission === 'media');
  });

  win.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault();
    const bb = deviceList.find(d => d.deviceName && d.deviceName.toLowerCase().includes('brainbit'));
    callback(bb ? bb.deviceId : deviceList[0]?.deviceId || '');
  });

  const indexPath = path.join(__dirname, 'src', 'index.html');
  console.log('Loading:', indexPath);
  win.loadFile(indexPath);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
