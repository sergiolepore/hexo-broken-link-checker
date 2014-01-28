## Introduction

This is a [hexo](https://github.com/tommy351/hexo) plugin which detects links that don't work, missing images and redirects.


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

## First run

Once you have all configured, you need to create a few files that will be used by this plugin. Run the following command:

```
hexo link_checker setup
```

You'll see something link this:

![](http://i2.minus.com/jDOtmwxDbVPIu.png)

If, for some reason, you execute this command twice, you'll see a warning message:

![](http://i3.minus.com/jete6SfBHv2fX.png)


__Pro Tip!__

`link_checker` command has an alias, `lc`. That said, `hexo link_checker [arguments]` and `hexo lc [arguments]` are the same command.


## Usage

#### Extracting links

First of all, make sure the plugin is enabled:

```
# _config.yml
link_checker:
  enabled: true
```

This will automatically register a _hexo post filter_, which is a function that processes your already rendered posts. The post filter will be called every time you run `hexo generate`, will extract and store all the links on your posts.
Currently, `hexo-broken-link-checker` detects:

* `<a>` tags.
* `<img>` tags.
* `YouTube embedded` videos.

So, as I said, run:

```
hexo generate
```

And you'll see the following messages:

![](http://i2.minus.com/iWPU1gRWyDEQz.png)


#### Scanning links

If you have a blog with 1000 posts, and each article has 2 external links, you'll have 2000 links to extract and check. That's a lot of operations just to check for success or error HTTP Codes, and that's why the extraction and scan are two different tasks.

Once `hexo generate` has finished the extraction process, you can run:

```
hexo lc scan
```

This command will take every link on the storage file and will make a HTTP request to it. All results will be stored on the same storage file.

![](http://i7.minus.com/ieskVuDVrSoXJ.png)


__Pro Tip!__

Because this command is slow and passive, you can use a cron job to check all of your links in background. For example:

```
# Every day at 10PM, go to my blog directory, run the scanner and only store the errors on linkchecker_error.log
0 22 * * * cd /home/me/MyBlog/ && hexo lc scan 2> linkchecker_errors.log
```

#### Checking the scan results

```
hexo lc show-links [options]
```

Options can be:

* `--filter=[all|broken|ok|redirects|unverified]`: filter links by status.
* `--id=[linkID]`: shows detailed info of a link.

Examples:

![](http://i7.minus.com/ibsEPD2ptMAd40.png)

![](http://i6.minus.com/ivA8JTFl6FK5Q.png)

![](http://i7.minus.com/iDkB9bsPElZlX.png)


#### Checking the log files

```
hexo lc show-logs
```

The screenshot below shows the log file when you set `silent_logs: true` into `_config.yml`:

![](http://i4.minus.com/iAqeZkqvwJnRL.png)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/sergiolepore/hexo-broken-link-checker/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

