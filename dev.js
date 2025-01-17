const { spawn } = require('child_process')
const path = require('path')

const startCommandInNewWindow = (command, args, cwd) => {
  const cmd = spawn(
    'cmd',
    ['/c', 'start', 'cmd', '/k', command + ' ' + args.join(' ')],
    { cwd, shell: true }
  )

  cmd.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  cmd.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

  cmd.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
}

const nestProjectPath = path.resolve('./')

startCommandInNewWindow('pnpm', ['start:dev'], nestProjectPath)

setTimeout(() => {
  process.exit()
}, 1000)
