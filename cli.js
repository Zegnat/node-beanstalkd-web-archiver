const path = require('path')
const FivebeansClient = require('fivebeans').client
const emitter = new FivebeansClient('localhost', 11300)
const tube = 'webarchive'

const saveDir = path.resolve(__dirname, 'tests')

if (process.argv[2]) {

    const domain = process.argv[2].replace(/^(http:|https:)\/\//, '')
    const joblist = [
      {
        type: 'node-beanstalkd-web-archiver',
        payload: {
          url: process.argv[2],
          html: saveDir + '/' + domain + '.html',
          screenshot: saveDir + '/' + domain + '.png'
        }
      }
    ]

    const looper = (error, jobid) => {
      if (typeof error === 'string') console.error('Job could not be PUT. ' + error)
      if (typeof jobid === 'string') console.log('Emitted job id: ' + jobid)
      if (joblist.length === 0) {
        console.log('No more jobs to emit.')
        emitter.end()
        process.exit(0)
      }
      emitter.put(0, 0, 60, JSON.stringify([tube, joblist.shift()]), looper)
    }

    emitter.on('connect', () => {
      emitter.use(tube, () => {
        console.log('Using tube: ' + tube)
        looper()
      })
    })

    emitter.connect()
} else {
    console.log('Please specify a URL:\n')
    console.log('node cli.js https://example.com\n')
}
