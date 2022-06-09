import { ipcRenderer } from 'electron';

ipcRenderer.on(`newDisplayBuffer`, (e, base64image) => {
  console.log(`attempt apply image`);
  console.log(base64image);

  // const test = document.createElement(`span`);
  // test.innerHTML = base64image;

  // document.getElementById(`selection`)?.appendChild()
  document.body.style.backgroundImage = `url(data:image/png;base64,${base64image})`;
});