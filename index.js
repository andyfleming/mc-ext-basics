'use strict'

module.exports = {
  vendor: 'mc',
  id: 'basics',
  name: 'Mission Control',
  description: 'A collection of basic stage types and utilities included with Mission Control.',
  stages: [
    require('./src/stages/pause-for-x-seconds'),
    require('./src/stages/run-local-shell-command'),
    require('./src/stages/run-remote-shell-command')
  ],
  logs: [
    require('./src/logs/snippet'),
    require('./src/logs/shell-command')
  ]
}
