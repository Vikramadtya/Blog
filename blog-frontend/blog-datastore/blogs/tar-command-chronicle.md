---
author: bcf59225-6b0a-4a5b-8d13-ecfb3840147a
blogNumber: 3
createdAt: '2024-12-20 00:13:39.323081'
demo:
  live: false
  preview: null
  repository: null
hash: 92076acbc994ebc83b0845a51b4b8f057c6212cf4e6f6ffaffbc91c767e91d9b
id: 9aecebee-4b11-4014-a6aa-8c11aac01dd1
previewImageSrc: ''
publish: true
slug: tar-command-chronicle
summary: >-
  Dive into the magic of the tar command and uncover its most practical and
  time-saving uses.
tags:
  - tar
  - linux
  - code
  - snippet
title: 'The Tar Command Chronicles: Bundle, Zip, and Conquer!'
type: snippet
updatedAt: '2025-08-06T18:21:35.547Z'
version: 15
toc:
  - level: 1
    title: Compress
  - level: 1
    title: Extract
  - level: 1
    title: List the contents
readingTime: 1 min read
wordCount: 181
imageCount: 0
links:
  internal: []
  external: []
code:
  count: 4
  languages:
    - shell
excerpt: ''
keywords:
  - tar
  - archive
  - file
  - compress
  - directory
---
Tar bundles multiple files into a single archive file, and can optionally compress them in Linux systems.

# Compress
To compress a file or directory


```shell
tar -cvf archive_file_name.tar <location-to-the-directory-or-file>
```

the options used in the above command are


- `-c` for creating a new archive
- `-v` to show the detailed output of the process.
- `-f` to specify the archive file.

to compress the archive using gzip use the option `-z` so the archive will be a `.tar.gz` file

```shell
tar -cvfz compressed_archive_file_name.tar.gz <location-to-the-directory-or-file>
```

> some other **gzip** (`-z`) alternative to compress the archive are **bzip2* (`-j`) and  **xz** (`-J`)

# Extract
To compress a file or directory


```shell
tar -C <location-to-the-directory-where-to-uncompress> -xvf archive_file_name.tar
```

the options used in the above command are

- `x` Extract files from an archive.
- `-v` to show the detailed output of the process.
- `-f` to specify the archive file.

# List the contents
To see the files in an archive

```shell
tar -tvf compressed_file_name.tar
```


> For a compressed archive provide the valid `-z` or `-j` or `-J` option 
