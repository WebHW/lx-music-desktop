console.log('this is index-dev.ts')

/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */
import {app} from 'electron'
import electronDebug from 'electron-debug'
import installExtension, {VUEJS3_DEVTOOLS} from 'electron-devtools-installer'
// 
electronDebug({
  showDevTools: true,
  devToolsMode: 'undocked',
})
// 
app.on('ready',()=>{
  installExtension(VUEJS3_DEVTOOLS)
  .then((name:string)=>{
    console.log(`Added Extension:  ${name}`)
  })
  .catch((err: Error) => {
    console.log('An error occurred: ', err)
  })
})
require('./index')
