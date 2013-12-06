## Introduction

This is a [hexo](https://github.com/tommy351/hexo) plugin which detects links that don't work, missing images and redirects.


#### This is a Work In Progress and it's not released on NPM yet.


![](http://i3.minus.com/icw5h1uvJKxqI.png)

![](http://i1.minus.com/ibbzd8eownAG1a.png)

![](http://i5.minus.com/ihC3tczVtPSiO.png)

![](http://i3.minus.com/ibtoOO5NzKB2dv.png)


## Plugin installation

Run the following command in the root directory of hexo:

```
npm install hexo-broken-link-checker --save
```

And enable the plugin in your `_config.yml`.

```
plugins:
  - hexo-broken-link-checker
```

## Configuration

Open your `_config.yml` file and paste the following lines:

```
# hexo-broken-link-checker plugin
link_checker:
  enabled: true
  storage_dir: temp/link_checker
  silent_logs: false
```

* `enabled: (boolean)` - Enables or disables the post inspection for links.
* `storage_dir: (string)` - Where do you want the plugin to store its files.
* `silent_logs: (boolean)` - If `true`, the logs will be placed in a log file instead of the console output.


## Usage

