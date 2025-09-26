prisma-merge
============

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/prisma-merge.svg)](https://npmjs.org/package/prisma-merge)
[![Downloads/week](https://img.shields.io/npm/dw/prisma-merge.svg)](https://npmjs.org/package/prisma-merge)
[![License](https://img.shields.io/npm/l/prisma-merge.svg)](https://github.com/https://github.com/inside-labs/prisma-merge/prisma-merge/blob/master/package.json)

Until prisma supports multiple schema definition files. See issue [#2377](https://github.com/prisma/prisma/issues/2377#issuecomment-735387818)
 
We define our `base-file` which usually contains your `datasource` and `generator` statement and define a glob pattern for our schema files (usually just `*.prisma`).
It will then output a merged version. 

We make use of the fact, that all generated schema files in migrations or the generated 
client are named `schema.prisma`. So as long as  we name our schema files something else and include `schema.prisma` in 
our excluded pattern (which is the default), we should be fine. You can also just copy the script and tailor it to your needs. 
The base & output file are excluded anyways and dont need to be added to the `excludedFilePatterns`

# Install
With yarn
```shell script
$ yarn global add prisma-merge
```
or npx
```shell script
$ npx prisma-merge
```
# Options
 ```
  -b, --baseFilePattern                            [default: src/**/*.base.prisma] Base file (can be glob), usually with datasource & generator statement
  -e, --excludedFilePatterns                       [default: src/**/schema.prisma] Glob patterns for excluded files (e.g schema.prisma in migrations / generated folder)
  -o, --outputFile                                 [default: src/prisma/schema.prisma] Output file
  -s, --schemaFilePatterns                         [default: src/**/*.prisma] Glob to all prisma files to include
  -h, --help                                       show CLI help
```
