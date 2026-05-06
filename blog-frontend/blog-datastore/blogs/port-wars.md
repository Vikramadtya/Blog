---
author: bcf59225-6b0a-4a5b-8d13-ecfb3840147a
blogNumber: 4
createdAt: '2024-12-23 22:05:31.298418'
demo:
  live: false
  preview: null
  repository: null
hash: f57c47b79fdb2ac7b0af43916a6efeb21dac7e0b649ef2f8a36b3f49f783100c
id: 9a29bcf1-14a8-475d-a61e-60a318d74d2c
previewImageSrc: ''
publish: true
slug: port-wars
summary: >-
  Stuck with a port already in use and don’t know which process is hogging it?
  This blog will guide you through finding the culprit and shutting it down like
  a pro.
tags:
  - linux
  - code
  - snippet
title: 'Port Wars: Hunt Down and Terminate Rogue Processes!'
type: snippet
updatedAt: '2025-08-06T18:21:35.542Z'
version: 10
toc:
  - level: 3
    title: 'Kill the process running on a specific port '
readingTime: 1 min read
wordCount: 67
imageCount: 0
links:
  internal: []
  external: []
code:
  count: 2
  languages:
    - shell
excerpt: ''
keywords:
  - port
  - kill
  - use
  - command
  - lsof
---
On macOS use the command `lsof -i` with the port number to find out what is running on a specific port.

```shell
sudo lsof -i :<portnumber>
```

&gt; This will work for linux as well ;) 

### Kill the process running on a specific port 
use the `kill` command with the -9 option and the port PID number to kill a process


```shell
kill -9 <pid>
```
