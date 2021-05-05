import { Menu } from 'electron';

export default function registerMenus() {

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {label: 'ああああ'},
        {type: 'separator'},
        {label: 'Save'},
        {label: 'Save As...'},
        {type: 'separator'},
        {label: 'Exit', click: (event) => {
          console.log(event)
        }}
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {label: 'Copy', accelerator: 'CmdOrCtrl+C'},
        {label: 'Paste', accelerator: 'CmdOrCtrl+V'},
      ]
    },
    {
      label: 'Help',
      submenu: [
        {label: 'About'}
      ]
    },
  ]))

}
