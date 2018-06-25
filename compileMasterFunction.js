const path = require('path')
const browserify = require('browserify')
const masterFunction = require('fs')
  .createWriteStream(path.resolve(__dirname, 'masterFunction.js'))

masterFunction
  .write('(async () => {\n')

browserify()
  .require(
    path.resolve(__dirname, 'node_modules/freeze-dry/lib/index.js'),
    {expose: 'freeze-dry'}
  )
  .bundle()
  .on('end', () => {
    masterFunction.write('return await require("freeze-dry").default()})')
    masterFunction.end()
  })
  .pipe(masterFunction, {end: false})
