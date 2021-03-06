'use strict'

let sshExec = require('ssh-exec')

module.exports = {

  id: 'run_remote_shell_command',
  name: 'Run Remote Shell Command(s)',
  description: 'Runs one or more commands on a remote server via SSH.',
  icon: '/extensions/mc/basics/icons/run_remote_shell_command.svg',

  options: {
    user: {
      name: 'User',
      description: 'User for the remote host',
      required: true,
      type: 'text'
    },
    host: {
      name: 'Host',
      description: "Address of remote host to run command on",
      required: true,
      type: 'text'
    },
    port: {
      name: 'Port',
      description: 'Port to connect to',
      required: true,
      type: 'text',
      default: '22'
    },
    commands: {
      name: 'Command(s)',
      description: "Command(s) to run",
      required: true,
      type: 'textarea'
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

    let options = {
      host: stage.option('host'),
      user: stage.option('user'),
      port: stage.option('port')
      //key: '',
      //password: ''
    }

    stage.log('mc.basics.logs.snippet', 'Running remote shell command', [commands])

    sshExec(commands, options, (err, stdout, stderr) => {

      // If there is a connection error, log accordingly and fail the stage
      if (err !== null && typeof err.code === 'object' && err.code.code === 'ECONNREFUSED') {
        console.log('Remote shell command could not connect to host')

        let details = 'host: ' + options.host
          + '\nuser: ' + options.user
          + '\nport: ' + options.port

        stage.log('mc.basics.logs.snippet', 'Could not connect to remote host', [details])
        stage.fail()
        return
      }

      // Capture the exit code
      let exitCode = (err !== null) ? err.code : 0

      // If there is an error (with an exit code), log the error to execution logs and fail the stage
      if (err !== null) {
        stage.log('mc.basics.logs.shell_command', 'Remote shell command execution completed.', [stdout, stderr, exitCode])
        stage.fail()

      } else {
        stage.log('mc.basics.logs.shell_command', 'Remote shell command execution completed.', [stdout, stderr, exitCode])
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
