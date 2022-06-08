import * as path from 'path';
import { app, BrowserWindow, Tray, Menu } from 'electron';

// should fix color reproduction
app.commandLine.appendSwitch(`force-color-profile`, `srgb`);

const trayIcon = path.join(__dirname, `assets/tray.png`)

let isClosing = false;

app.on(`ready`, () => {
  const tray = new Tray(trayIcon);

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      icon: trayIcon,
      label: `Freeze Frame`
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
        // TODO: open github wiki page
      }
    },
    {
      label: `About`, click: () => {
        // TODO: open settings menu
      }
    },
    {
      label: `GitHub`, click: () => {
        // TODO: open github repo page
      }
    },
    {
      type: `separator`
    },
    {
      label: `Quit`,
      role: `quit`,
      // click: () => {
      //   isClosing = true;
      //   app.quit();
      // }
    }
  ]));

  // const window = new BrowserWindow({
  //   show: false,
  //   fullscreen: true,
  //   frame: false,
  //   autoHideMenuBar: true,
  //   webPreferences: {
  //     preload: path.join(__dirname, `assets/scripts/preload.js`),
  //     contextIsolation: true,
  //     nodeIntegration: false // this should be false by default, but better safe than sorry
  //   }
  // });

  // window.loadFile(`views/crop.html`);

  // window.webContents.on(`did-finish-load`, function() {
  //   window.show();
  // });
});

app.on(`before-quit`, () => {
  isClosing = true;
});