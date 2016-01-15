'use strict'

// 15.36MB
const MAX_BUFFER = 15000 * 1024

let exec = require('child_process').exec
let shellCommandLog = require('../logs/shell-command')

module.exports = {

  id: 'run_local_shell_command',
  name: 'Run Local Shell Command(s)',
  description: 'Runs one or more commands in the local shell environment.',
  icon: '/extensions/mc/basics/icons/run_local_shell_command.svg',

  options: {
    commands: {
      name: 'Command(s)',
      description: 'Command(s) to run',
      required: true,
      type: 'textarea'
    },
    timeout: {
      name: 'Timeout',
      description: 'Timeout (in seconds)',
      required: true,
      type: 'text',
      default: 600 // 10 minutes
    }
  },

  outputs: {
    stdout: {
      description: 'Output from command'
    },
    stderr: {
      description: 'Error output from command'
    },
    exit_code: {
      description: 'Exit code after execution'
    }
  },

  execute: function(stage) {

    let commands = stage.option('commands')
    let timeout = stage.option('timeout') * 1000 // convert seconds to milliseconds

    stage.log('mc.basics.logs.snippet', 'Running shell command', [commands])

    exec(commands, {
    	timeout: timeout,
    	maxBuffer: MAX_BUFFER
    }, function (err, stdout, stderr) {

      let exitCode = (err !== null) ? err.code : 0

      stage.log('mc.basics.logs.shell_command', 'Local shell command execution completed.', [stdout, stderr, exitCode])

      if (err !== null) {
        stage.fail()
      } else {
        stage.output({
          stdout: stdout,
          stderr: stderr,
          exit_code: exitCode
        })
        stage.succeed()
      }

    })

  }

}
