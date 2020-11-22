# Bee Dir

[![CircleCI](https://flat.badgen.net/circleci/github/auhau/bee-dir/master)](https://circleci.com/gh/auhau/bee-dir/)
[![](https://img.shields.io/badge/project-Swarm-blue.svg?style=flat-square)](http://ethswarm.org/)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
[![Managed by tAsEgir](https://img.shields.io/badge/%20managed%20by-tasegir-brightgreen?style=flat-square)](https://github.com/auhau/tasegir)
![](https://img.shields.io/badge/npm-%3E%3D6.0.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/Node.js-%3E%3D10.0.0-orange.svg?style=flat-square)

> Upload your directories to Bee with TypeScript!

## Table of Contents

- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Usage

As this package is not released to NPM, you have to clone the repo locally:
```
$ git clone https://github.com/AuHau/bee-dir.git
$ cd bee-dir
$ npm i
$ ./start_bee_node.sh &
$ npm start -- /path/to/directory
```

Help page that you get when run `npm start -- --help`:
```
Uploads specified directory to Swarm and after that verify the files were correctly uploaded.

USAGE
  $ bee-dir DIR

ARGUMENTS
  DIR  directory to upload

OPTIONS
  -b, --bee=bee    [default: http://localhost:8080] URL pointing to running instance of Bee [env: BEE_URL]
  -r, --recursive  Determines if nested directories should be uploaded as well
  -v, --verify     After finishing uploading the files, all files are re-downloaded and verified

DESCRIPTION
  Verification is performed using comparing the sizes of the files.
```

## Contribute

There are some ways you can make this module better:

- Consult our [open issues](https://github.com/auhau/bee-dir/issues) and take on one of them
- Help our tests reach 100% coverage!

### Tests

In order to run tests first startup Bee node with `./start_bee_node.sh` script (Docker required).
Then run tests with `npm test`.

## License

[GNU GPL-3](./LICENSE)
