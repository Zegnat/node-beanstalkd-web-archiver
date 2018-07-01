const path = require('path')
const FivebeansClient = require('fivebeans').client
const emitter = new FivebeansClient('localhost', 11300)
const tube = 'webarchive'

const saveDir = path.resolve(__dirname, 'tests')

const joblist = [
  {
    type: 'node-beanstalkd-web-archiver',
    payload: {
      screenshot: saveDir + '/example.com.png',
      html: saveDir + '/example.com.html'
    }
  },
  {
    type: 'node-beanstalkd-web-archiver',
    payload: {
      url: 'https://example.com/'
    }
  },
  {
    type: 'node-beanstalkd-web-archiver',
    payload: {
      url: 'https://example.com/',
      html: saveDir + '/example.com.html'
    }
  },
  {
    type: 'node-beanstalkd-web-archiver',
    payload: {
      url: 'https://example.org/',
      screenshot: saveDir + '/example.org.png'
    }
  },
  {
    type: 'node-beanstalkd-web-archiver',
    payload: {
      url: 'https://example.net/',
      html: saveDir + '/example.net.html',
      screenshot: saveDir + '/example.net.png'
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
