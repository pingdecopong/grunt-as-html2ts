# grunt-html2ts

> Create typescript string templates for html files.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-html2ts --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-html2ts');
```

## The "html2ts" task

### Overview
In your project's Gruntfile, add a section named `html2ts` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  html2ts: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.truncateNamespace
Type: `String`
Default value: null

A string that is truncated from the start of the generated typescript module namespace. 

#### options.truncateDir
Type: `String`
Default value: null

A string that is truncated from the start of the generated output path when the htmlOutDir option is specified.

#### options.htmlOutDir
Type: `String`
Default value: null

If specified the typescript will be generated starting in this directory.

#### options.flatten
Type: `Boolean`
Default value: false

If true all the generated typescript will be in the output directory rather than in a copy of the original directory hierarchy.

### Usage Examples

#### Default Options
In this example, all html files matching `test/app/**/*.html` will be transformed into typescript files with a copy of the original directory hierarchy into the `test/.out` directory. 

```js
grunt.initConfig({
   html2ts: {
      default: {
        options: {
          truncateNamespace: 'test',
          truncateDir: 'test/app',
          htmlOutDir: 'test/.out',
          flatten: false
        },
        files: {
          options: ['test/app/**/*.html']
        }
      }
    },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 Bernd Wessels. Licensed under the MIT license.
