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
feasible to run the freeze-dry script in a headless browser.

## License

The BSD Zero Clause License (0BSD). Please see the LICENSE file for
more information.
