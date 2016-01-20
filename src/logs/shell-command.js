'use strict'

module.exports = {

  id: 'shell_command',
  name: 'Shell Command Log',
  description: 'Easily logs and formats output for a log made from shell execution',

  generate: function(stdout, stderr, exitCode) {
    return {
      stdout: stdout,
      stderr: stderr,
      exitCode: exitCode
    }
  },

  _convertColorCodes: function(content) {

    if (!content) {
      return content
    }

    let replacementDictionary = {
      '[0;33m': '<span class="yellow">',
      '[1;30m': '<span class="black">',
      '[1;31m': '<span class="red">',
      '[0;32m': '<span class="bright-green">',
      '[1;32m': '<span class="green">',
      '[1;33m': '<span class="yellow">',
      '[1;34m': '<span class="blue">',
      '[1;35m': '<span class="purple">',
      '[1;36m': '<span class="cyan">',
      '[1;37m': '<span class="white">',
      '[0;0m': '</span>',
      '[0m'  : '</span>',
      '[m'   : '</span>'
    }

    Object.keys(replacementDictionary).map(function(key) {
      content = content.replace(key, replacementDictionary[key])
    });

    return content

  },

  _getExitText: function(exitCode) {

    let exitTextMap = {
      0: 'OK',
      1: 'General error',
      2: 'Misuse of shell builtins',

      126: 'Invoked command cannot execute',
      127: 'Command not found',
      128: 'Invalid exit argument',

      // signals
      129: 'Hangup',
      130: 'Interrupt',
      131: 'Quit and dump core',
      132: 'Illegal instruction',
      133: 'Trace/breakpoint trap',
      134: 'Process aborted',
      135: 'Bus error: "access to undefined portion of memory object"',
      136: 'Floating point exception: "erroneous arithmetic operation"',
      137: 'Kill (terminate immediately)',
      138: 'User-defined 1',
      139: 'Segmentation violation',
      140: 'User-defined 2',
      141: 'Write to pipe with no one reading',
      142: 'Signal raised by alarm',
      143: 'Termination (request to terminate)',
      // 144 - not defined
      145: 'Child process terminated, stopped (or continued*)',
      146: 'Continue if stopped',
      147: 'Stop executing temporarily',
      148: 'Terminal stop signal',
      149: 'Background process attempting to read from tty ("in")',
      150: 'Background process attempting to write to tty ("out")',
      151: 'Urgent data available on socket',
      152: 'CPU time limit exceeded',
      153: 'File size limit exceeded',
      154: 'Signal raised by timer counting virtual time: "virtual timer expired"',
      155: 'Profiling timer expired',
      // 156 - not defined
      157: 'Pollable event',
      // 158 - not defined
      159: 'Bad syscall'
    }

    if (typeof exitTextMap[exitCode] !== 'undefined') {
      return exitTextMap[exitCode]
    } else {
      return 'Unknown Exit Code'
    }

  },

  renderDetails: function(data) {

    let html = ''

    html += '<h5>Exit Code and Text:</h5>'
    html += '<pre>' + data.exitCode + ' - ' + this._getExitText(data.exitCode) + '</pre>'
    html += '<h5>Output (STDOUT):</h5>'
    html += '<pre class="shell-output">' + this._convertColorCodes(data.stdout) + '</pre>'
    html += '<h5>Error Output (STDERR):</h5>'
    html += '<pre class="shell-output">' + this._convertColorCodes(data.stderr) + '</pre>'

    return html

  }

}
