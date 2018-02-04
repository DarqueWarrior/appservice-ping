# AppService-Ping

You can use this module to ping a site to make sure it is available before you try and deploy to it. 

This is useful when deploying to Azure with ARM templates. The deployment will return before the site is actually ready to accept a WAR file.  To give Tomcat time to get ready you can use this module to ping the site during your automatic deployment. Once this returns it is safe to copy your WAR file with the deployment task.

## Installation
```bash
npm install -g appservice-ping
```
## Usage
```bash
appservice-ping
```

## Command Line Interface (cli)
Usage:

  appservice-ping [OPTIONS] [ARGS]

Options:
*  -u, --url STRING       Url to ping (Required)
*  -t, --timeout [NUMBER] Timeout between each retry (Default is 60000)
*  -r, --retries [NUMBER] Number of times to retry (Default is 10)
*  -h, --help             Display help and usage details

```bash
appservice-ping -u http://someUrlToPing.com -t 1000 -r 10
```