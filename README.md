# Taffee.JS

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

 | Dependency  | Version |
 |-------------|---------|
 | NodeJS      | ^10.15  |
 | argparse    | ^1.0.10 |
 | cosmiconfig | ^5.1.0  |
 | eslint      | ^5.12.0 |
 | handlebars  | ^4.1.0  |
 | husky       | ^1.3.1  |
 | mocha       | ^5.2.0  |
 | nyc         | ^13.3.0 |
 | showdown    | ^1.9.0  |
 | sinon       | ^7.2.2  |

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
    "bdd" : "taffee -c .tafferc"
  },
...
```
 - Make your test cases in the directory specified in the config

### Usage

#### Generic Markdown File

[test1.md](demo/js/markdown/test1.md)
```
[](i:NodeInvoker)
[](m:../testFacade.js)

# Saying hello world!
Our project rocks and needs to output Hello world!

## Example
When the project function is called then we see the output [Hello World](t:Test.testHelloWorld()).
```

#### Invokers

An invoker is a specific class which calls a specific script to execute as a child process in your system.
An invoker can be defined in a markdown file using either `i`, `inv` or `invoker`.
Here is a list of currently available invokers: 

* PhpInvoker : Invokes a `php` file on your system.
* NodeInvoker : Invokes a `node` file on your system.

Declaration examples:
```
[](i:NodeInvoker)
[](inv:PhpInvoker)
[](invoker:NodeInvoker)
```

#### Modules

A module is an entry-point to the software you want to run the tests on. 
It contains the class that will have tests ran on.
It can be defined in a markdown file using either `m`, `mod` or `module`.

Declaration example:
```
[](m:../testFacade.js)
[](mod:~/projects/myProject/testFacade.php)
[](module:./myModule.js)
```

The entry-point must contain a class of the same name as the one given by the tests defined further in the Markdown.
This class must also possess the functions declared in the Markdown. 
These functions must contain the provided named parameters as an object (which allows unordered processing).

Example : 
Markdown:
```
[](i:NodeInvoker)
[](m:../testFacade.js)
[1](v:a), [2](v:b)
[Expected](t:Test.myTest(a, b)).
```

Module (testfacade.js):
```
class Test{
    myTest({a = 0, b = 0}){
        if(a + b === 3){
            return "Expected";
        }
    }
}
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

Original contributors (**Les Chevaliers de Coallier**):
 - [Grasseh](https://github.com/Grasseh)
 - [Stalfy](https://github.com/Stalfy)
 - [KB07](https://github.com/KB07)
 - [doomy23](https://github.com/doomy23)
 - [Lolskate](https://github.com/Lolskate)
