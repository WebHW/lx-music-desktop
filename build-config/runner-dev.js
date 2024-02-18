process.env.NODE_ENV = 'development'

const chalk = require('chalk')
const electron = require('electron')
const path = require('path')

const { spawn } = require('child_process')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackHotMiddleware = require('webpack-hot-middleware')

const mainConfig = require('./main/webpack.config.dev')
// const rendererConfig = require('./renderer/webpack.config.dev')
// const rendererLyricConfig = require('./renderer-lyric/webpack.config.dev')
// const rendererScriptConfig = require('./renderer-scripts/webpack.config.dev')

const { Arch } = require('electron-builder')
// const replaceLib = require('./build-before-pack')

let electronProcess = null
let manualRestart = false
// let hotMiddlewareRenderer
// let hotMiddlewareRendererLyric


function startMain(){
  return new Promise((resolve, reject) => {

    const compiler = webpack(mainConfig)
    compiler.hooks.watchRun.tapAsync('watch-run', (compilation,done) => {
      // hotMiddlewareRenderer.publish({actions:'compiling'})
      // hotMiddlewareRendererLlyric.publish({actions:'compiling'})
      done()
    })

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err)
        return
      }

      if(electronProcess && electronProcess.kill){
        manualRestart = true
        process.kill(electronProcess.pid)
        electronProcess = null
        startElectron()
        setTimeout(() => {
          manualRestart = false
        },5000)
      }

      resolve()
    })
  })
}

function startElectron() {
  let args = [
    '--inspect=5858',
    // 'NODE_ENV=development',
    path.join(__dirname, '../dist/main.js'),
  ]

  // detect yarn or npm and process commandline args accordingly
  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args = args.concat(process.argv.slice(3))
  } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args = args.concat(process.argv.slice(2))
  }

  electronProcess = spawn(electron, args)

  electronProcess.stdout.on('data', data => {
    electronLog(data, 'blue')
  })
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'red')
  })

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
  })
  
}

const logs = [
  'Manifest version 2 is deprecated, and support will be removed in 2023',
  '"Extension server error: Operation failed: Permission denied", source: devtools://devtools/bundled',

  // https://github.com/electron/electron/issues/32133
  '"Electron sandbox_bundle.js script failed to run"',
  '"TypeError: object null is not iterable (cannot read property Symbol(Symbol.iterator))",',
]

function electronLog(data, color) {
  let log = data.toString()
  if (/[0-9A-z]+/.test(log)) {
    if (color == 'red' && typeof log == 'string' && logs.some(l => log.includes(l))) return
    console.log(chalk[color](log))
  }

}
function init() {
  const Spinnies = require('spinnies')
  const spinnies = new Spinnies({color:'blue'})
  spinnies.add('main', {text: 'Main compiling'})

  function handleSuccess(name) {
    spinnies.succeed('main', {text:name + ' compiling success!'})
  }

  function handleFail(name) {
    spinnies.fail('main', {text:name + ' compiling fail!'})
  }
  // replaceLib({electronPlatformName: process.platform,arch: Arch[process.arch]})

  Promise.all([
    startMain().then(()=>handleSuccess('Main')).catch(()=>handleFail('Main')),
  ]).then(startElectron).catch(err=>{
    console.log(err)
  })
}

init()