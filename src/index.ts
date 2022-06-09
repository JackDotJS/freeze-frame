import { app, BrowserWindow, Tray, Menu, nativeImage, shell } from 'electron';
import * as path from 'path';

// should fix color reproduction
app.commandLine.appendSwitch(`force-color-profile`, `srgb`);

const trayIcon = nativeImage.createFromPath(path.join(__dirname, `../assets/tray.png`));

let isClosing = false;

app.whenReady().then(() => {
  const window = new BrowserWindow({
    show: false,
    fullscreen: true,
    frame: false,
    autoHideMenuBar: true,
    // webPreferences: {
    //   preload: path.join(__dirname, `assets/scripts/preload.js`),
    //   contextIsolation: true,
    //   nodeIntegration: false // this should be false by default, but better safe than sorry
    // }
  });

  window.loadFile(path.join(__dirname, `../views/crop.html`));
  
  const tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));

  tray.setToolTip(`Freeze Frame`)

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      icon: trayIcon,
      label: `Freeze Frame`,
      enabled: false
    },
    {
      type: `separator`
    },
    {
      label: `Screenshot`, click: () => {
        window.show();
      }
    },
    {
      type: `separator`
    },
    {
      label: `Settings`, click: () => {
        // TODO: open settings menu
      }
    },
    {
      label: `Help`, click: () => {
        shell.openExternal(`https://github.com/JackDotJS/freeze-frame/wiki`)
      }
    },
    {
      label: `About`, click: () => {
        // TODO: open settings menu
      }
    },
    {
      label: `GitHub`, click: () => {
        shell.openExternal(`https://github.com/JackDotJS/freeze-frame`);
      }
    },
    {
      type: `separator`
    },
    {
      label: `Quit`,
      role: `quit`
    }
  ]));
});

app.on(`before-quit`, () => {
  isClosing = true;
});