import * as path from 'path';
import { app, BrowserWindow, Tray, Menu, nativeImage, shell, ipcMain } from 'electron';
import { uIOhook, UiohookKey } from 'uiohook-napi';
const screenshot = require(`screenshot-desktop`);

// should fix color reproduction
app.commandLine.appendSwitch(`force-color-profile`, `srgb`);

const trayIcon = nativeImage.createFromPath(path.join(__dirname, `../assets/tray.png`));

let isClosing: Boolean = false;

app.whenReady().then(() => {
  const editor = new BrowserWindow({
    show: false,
    fullscreen: true,
    frame: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, `preload.js`),
      contextIsolation: true,
      nodeIntegration: false // this should be false by default, but better safe than sorry
    }
  });

  editor.loadFile(path.join(__dirname, `../views/crop.html`));

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
      label: `Take a Screenshot`, click: () => {
        editor.show();
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

  uIOhook.on('keydown', (e) => {
    if (e.keycode === UiohookKey.J) {
      console.log(`test`);
    }
  
    // UiohookKey doesn't have the print screen key code listed for some fucking reason
    // so i had to find it manually
    if (e.keycode === 0x0e37) {
      const dstart = new Date();
      screenshot({ format: `jpg` }).then((image: Buffer) => {
        const dend = new Date();
        console.log(`shouldShow (delay: ${dend.getTime() - dstart.getTime()})`);
        editor.show();
        editor.focus();
        editor.moveTop();

        editor.webContents.send(`newDisplayBuffer`, image.toString(`base64`));
      });
    }
  
    if (e.keycode === UiohookKey.Escape && editor.isFocused()) {
      console.log(`shouldHide`);
      editor.hide();
      editor.minimize();
    }
  })
  
  uIOhook.start()
});

app.on(`before-quit`, () => {
  isClosing = true;
});