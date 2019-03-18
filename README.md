# PFE (Nom à déterminer)

[![Build Status](https://travis-ci.org/Grasseh/PFE_H_2019.svg?branch=master)](https://travis-ci.org/Grasseh/PFE_H_2019)
[![Code Coverage](https://codecov.io/gh/grasseh/PFE_H_2019/branch/master/graph/badge.svg)](https://codecov.io/gh/grasseh/PFE_H_2019)

BDD Framework to sweetly display software test results from Markdown files.

## Index

 - [Dependencies](#dependencies)
 - [Getting started](#getting-started)
    - [Setup](#setup)
    - [Usage](#usage)
 - [Contributing](#contributing)
 - [License](#license)

 ## Dependencies

 | Dependency | Version |
 |------------|---------|
 | NodeJS     | ^10.15  |
 | eslint     | ^5.12.0 |
 | husky      | ^1.3.1  |
 | mocha      | ^5.2.0  |
 | nyc        | ^13.1.0 |
 | sinon      | ^7.2.2  |
 | showdown   | ^1.9.0  |

## Getting started

### Setup

 - Make sure you have the latest version of NodeJS and NPM
 - `npm install git+https://github.com/Grasseh/PFE_H_2019.git --save-dev`
 - Make a directory in your project for your Markdown files and the outputs
 - Add a `.pferc` file to the root of your project similar to the following :
```
{
    "outputPath" : "/path/to/markdown/output",
    "basePath" : "/path/to/markdown"
}
```
- To use it with npm easily : add the framework to your `scripts` in *package.json* with something like this :
```
...
"scripts": {
    ...
    "bdd" : "pfe -c .pfrec"
  },
...
```
 - Make your test cases in the directory specified in the config

### Usage

#### Example 1

[test1.md](demo/js/markdown/test1.md)
```
[](i:NodeInvoker)
[](m:../testFacade.js)

# Saying hello world!
Our project rocks and needs to output Hello world!

## Example
When the project function is called then we see the output [Hello World](t:Test.testHelloWorld()).
```

## Contributing

If you wish to contribute please read the following guide:

1. Clone this repository
2. Run `npm install` at the root of the repo.
3. Create a feature branch for your feature, or a fork.
4. Code your feature
5. Write tests for your feature
6. Run tests with `npm test`
7. Make sure your style is fine with `npm run eslint`
8. Commit your changes
9. Make a pull-request on the repo
10. Ask a reviewer to validate your pull-request
11. Be collaborative and respectful =)

## License

The code is released under [MIT license](LICENSE) and its dependencies have their own licensing. For more informations, please consult their website.
