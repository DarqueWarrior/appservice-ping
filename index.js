const fs = require('fs');
const cli = require('cli');
const path = require('path');
const async = require('async');
const request = require('request');

function main(args) {
   var packageContents = fs.readFileSync(path.join(__dirname, './package.json'), 'utf8');
   var packageJson = JSON.parse(packageContents);

   console.log('Azure App Service Ping by @DonovaBrown v' + packageJson.version);

   cli.setArgv(process.argv);
   var options = cli.parse({
      url: ['u', 'Url to ping (Required)', 'string', null],
      timeout: ['t', 'Timeout between each retry', 'int', 60000],
      retries: ['r', 'Number of times to retry', 'int', 10]
   });

   if (!options.url) {
      cli.getUsage();

      return -1;
   }

   var count = 0;
   var exitCode = -1;
   var log = process.env.SYSTEM_DEBUG || `false`;
   log = log.toLowerCase();

   if(log === `true`) {
      console.log(`Arguments:`);
      console.log(`url: ${options.url}`);
      console.log(`timeout: ${options.timeout}`);
      console.log(`retries: ${options.retries}`);      
   }

   async.whilst(
      function () {
         return count < options.retries && exitCode !== 0;
      },
      function (finished) {
         setTimeout(function () {
            request({
               url: options.url,
            }, function (err, res, body) {
               count++;

               if(log === `true`) {
                  console.log(`Attempt: ${count}`);
                  console.log(`err: ${err}`);
                  console.log(`res.statusCode: ${res.statusCode}`);
               }

               if (!err && res.statusCode < 400) {
                  exitCode = 0;
                  finished(null, 0)
               } else {
                  finished(null, 1)
               }
            });
         }, options.timeout);
      },
      function (err, n) {
         // Set the exit code
         if (n === 1) {
            process.exit(1);
         }
      }
   );
}

/*
 * Exports the portions of the file we want to share with files that require 
 * it.
 */
module.exports = {
   main: main
};