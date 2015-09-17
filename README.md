# grunt-upload2upyun

> Upload files to UPYUN.

> 将本地文件上传到UPYUN。

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-upload2upyun --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-upload2upyun');
```

## The "upload2upyun" task

### Overview
In your project's Gruntfile, add a section named `upload2upyun` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  upload2upyun: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.bucket
Type: `String`
Default value: `''`

空间名称。请参考又拍云对此术语的定义。

#### options.operator
Type: `String`
Default value: `''`

操作员名称。请参考又拍云对此术语的定义。

#### options.password
Type: `String`
Default value: `''`

操作员密码。请参考又拍云对此术语的定义。

### Usage Examples

```js
grunt.initConfig({
  upload2upyun: {
    options: {
      bucket: 'my-first-bucket', //空间名称
      operator: 'somebody', //操作员名称
      password: 'secret', //密码
    },
    main: {
      files: [
        // includes files within path
        {expand: true, src: ['path/*'], dest: '/dest/', filter: 'isFile'},

        // includes files within path and its sub-directories
        {expand: true, src: ['path/**'], dest: '/dest/'},

        // makes all src relative to cwd
        {expand: true, cwd: 'path/', src: ['**'], dest: '/dest/'},

        // flattens results to a single level
        {expand: true, flatten: true, src: ['path/**'], dest: '/dest/', filter: 'isFile'}
      ]
    }
  },
});
```

This task supports all the file mapping format Grunt supports. Please read [Globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns) and [Building the files object dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically) for additional details.

**注意：** 由于在云空间上建立空目录没有实际意义，因此，本地空目录将被略过。

**注意：** `dest` UPYUN 上的目标目录必须以 `/` 开头！

## 版权和协议

本插件所有代码版权归 [Bootstrap中文网](http://www.bootcss.com) 所有，遵循 MIT 开源协议。
