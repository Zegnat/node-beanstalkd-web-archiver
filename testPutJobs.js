const path = require('path')
const FivebeansClient = require('fivebeans').client
const emitter = new FivebeansClient('localhost', 11300)
const tube = 'webarchive'

const joblist = [
  {
    type: 'node-beanstalkd-web-archiver',
    payload: {
      screenshot: path.resolve(__dirname, 'example.com.png'),
      html: path.resolve(__dirname, 'example.com.html')
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
      html: path.resolve(__dirname, 'example.com.html')
    }
  },
  {
    type: 'node-beanstalkd-web-archiver',
    payload: {
      url: 'https://example.org/',
      screenshot: path.resolve(__dirname, 'example.org.html')
    }
  },
  {
    type: 'node-beanstalkd-web-archiver',
    payload: {
      url: 'https://example.net/',
      html: path.resolve(__dirname, 'example.net.html'),
      screenshot: path.resolve(__dirname, 'example.net.png')
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
