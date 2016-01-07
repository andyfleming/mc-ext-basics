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

    stage.log('Running remote shell command')

    sshExec(commands, options, (err, stdout, stderr) => {
      let exitCode = (err !== null) ? err.code : 0

      stage.log('mc.basics.logs.shell_command', 'Remote shell command execution completed.', [stdout, stderr, exitCode])

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
