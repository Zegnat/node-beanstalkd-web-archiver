# Beanstalkd Web Archiver

Great dreams, very little implementation. (So far.)

This repository holds my try at creating a web archiver service that I can then 
use to create static copies of pages I bookmark, among many other use cases. 
The design idea:

1. Have a process that watches a beanstalkd tube for URLs to archive.
2. When a URL comes in, start a headless browser that loads the URL.
3. When the URL has been loaded:
   
   1. Create a screenshot of the page as a static archival copy.
   2. Freeze-dry the page DOM and save the frozen DOM as an interactive 
      archival copy.

Currently all that is implemented is a proof of concept that shows it is 
feasible to run the `freeze-dry` script in a headless browser. Technologies 
used:

- [freeze-dry](https://github.com/webmemex/freeze-dry)
- [GoogleChrome Puppeteer](https://github.com/GoogleChrome/puppeteer)
- [Beanstalkd](http://kr.github.io/beanstalkd/)

## Running on Debian

First install dependencies and run Beanstalk service

```
sudo apt-get install chromium beanstalkd
sudo systemctl start beanstalkd
```

Then clone this repo, install depdencies, and run the process

```
cd node-beanstalkd-web-archiver/
npm install
npm run start-debian
```

*Due to [this issue](https://github.com/GoogleChrome/puppeteer/issues/290)
on Debian, Puppeteer needs the `--no-sandbox --disable-setuid-sandbox` flags, 
which is not good security wise, but is the only way to make it work.*

## Running on other OSs

On non-Debian OSs install the same dependencies above with the following

```
npm run start
``` 

## Using the tool

Assuming the above runs without error, in a new termianl run the test data:

```
node testPutJobs.js --path
```

By running the `testPutJobs.js` you should see the following files in `tests/`

```
tests
├── example.com.html
├── example.net.html
├── example.net.png
└── example.org.png
```

You can also snapshot manual domains with the following

```
node cli.js https://example.com
``` 

## License

The BSD Zero Clause License (0BSD). Please see the LICENSE file for
more information.
