
var gulp = require('gulp');
var path = require('path');
var underscore = require('underscore');
var configManager = require('./configurationManager');
var config = require('./configurationManager').get();

var appDir = config.appDir;
var paymentB2PPage = config.paymentB2PPage;
var invoicePreviewPage = config.invoicePreviewPage;
var bankStatementErrorPage = config.bankStatementErrorPage;
var destPathName = config.destPathName;
var util = require('gulp-util');
var runSequence = require('run-sequence').use(gulp);
var del = require('del');
var stylus = require('gulp-stylus');
var nib = require('nib');
var gft = require('gulp-file-tree');
var tinylr;

var expressSrc = path.join(__dirname, '../dist'),
    markupPath = config.markupPath, // path.join(__dirname, '../markup'),
    port = config.servePort,
    urlPort = config.urlPort || port,
    lrPort = config.liveReloadPort;

gulp.task('express', function (cb) {
    var express = require('express');
    var app = express();
    console.log(('start express in ' + expressSrc).green);
    app.use(require('connect-livereload')({port: lrPort}));
    app.use(express.static(expressSrc, {
        setHeaders: function (res, path, stat) {
            res.set('cache-control', "no-cache")
        }
    }));
    app.listen(port);
    cb();
});

gulp.task('markup-express', function (cb) {
    var mPort = 4011;
    var mUrlPort = 81;
    var url = 'http://markup.developer.modulbank.ru:'
    var express = require('express');
    var app = express();
    console.log(('start express in ' + markupPath).green);
    //app.use(require('connect-livereload')({port: lrPort}));
    app.use(express.static(markupPath, {
        setHeaders: function (res, path, stat) {
            res.set('cache-control', "no-cache")
        }
    }));
    app.listen(mPort);
    var url = url + mUrlPort + '/html/allfiles.html';
    console.log(('Open ' + url).green);
    require('opn')(url);
    cb();
});

gulp.task('markup-clean', del.bind(null, [markupPath + '/css', markupPath + '/html/tree.json'], {force: true}));

gulp.task('markup-html-files', function () {
    return gulp.src(markupPath + '/html/**/*.html')
        .pipe(gft())
        .pipe(gulp.dest(markupPath + '/html'));
});

gulp.task('markup-styl', function () {
    return gulp
        .src(markupPath + '/stylus/*.styl')
        .pipe(stylus({
            use: nib(),
            'include css': true
        }))
        .pipe(gulp.dest(markupPath + '/css/'));
});

gulp.task('markup', ['markup-clean'], function (callback) {
    runSequence('markup-styl', 'markup-html-files', 'markup-express', callback);
});

gulp.task('livereload', function (cb) {
    tinylr = require('tiny-lr')();
    tinylr.listen(lrPort);
    cb();
});

gulp.task('open', function (cb) {
    var url = config.url + urlPort + '/';
    console.log(('Open ' + url).green);
    require('opn')(url);
    cb();
});

function notifyLiveReload(event) {
    console.log(('NotifyLiveReload').yellow);

    var fileName = require('path').relative(__dirname, event.path);
    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

function debounce(fn, timeout, immediately, context) {
    var t;
    return function () {
        var cntx = context || this;
        var args = arguments;
        if (t) {
            clearTimeout(t);
            t == null;
        }
        if (!t) {
            t = setTimeout(function () {
                fn.apply(cntx, args);
                t = null;
            }, timeout);
        }
    }
}

gulp.task('watch', watchFiles);

function watchFiles(cb) {
    if (config.watch) {
        var debounceDelay = 1500;
        var gulpWatchOptions = {debounceDelay: debounceDelay};
        var commonSource = config.commonSource;

        var startTasks = function startTasks(tasks) {
            return function (e) {
                console.log(('Watch file: ' + e.path).yellow);
                this.start(tasks);
            }.bind(this);
        }.bind(this);

        console.log('Start watching angular templates');
        gulp.watch([appDir + '/js/**/*.html'], gulpWatchOptions, startTasks(['html-templates', 'templateCache']));
        console.log('Start watching common templates');
        gulp.watch([commonSource + '/ui/**/*.html'], gulpWatchOptions, startTasks(['html-templates', 'common-template-scripts']));

        console.log('Start watching payment templates');
        gulp.watch([appDir + '/' + paymentB2PPage], gulpWatchOptions, startTasks('paymentWatchTemplate'));
        gulp.watch([appDir + '/' + invoicePreviewPage], gulpWatchOptions, startTasks('invoicePreviewWatchTemplate'));
        console.log('Start watching bankstatementerror page');
        gulp.watch([appDir + '/' + bankStatementErrorPage], gulpWatchOptions, startTasks('bankStatementWatchTemplate'));

        if (config.livereload) {
            var callNotifyLiveReload = underscore.debounce(function (event) {
                notifyLiveReload(event)
            }, 1000);
            gulp.watch([destPathName + '/js/**/*.js', destPathName + '/js/**/*.html', destPathName + '/ui/**/*.html', commonSource + '/ui/**/*.html'], gulpWatchOptions, callNotifyLiveReload);
        }
    }

    cb();
}

gulp.task('fast-watch', watchFiles);

gulp.task('serve', function (done) {
    configManager.set({
        watch: true,
        livereload: true
    });
    runSequence('build', 'express', 'livereload', 'watch', 'open', done);
});

gulp.task('fast', function (done) {
    configManager.set({
        watch: true,
        livereload: true
    });
    runSequence('part-build', 'express', 'livereload', 'fast-watch', 'open', done);
});

gulp.task('serveNoReload', function (done) {
    configManager.set({
        watch: true,
        livereload: false
    });
    runSequence('build', 'express', 'livereload', 'watch', 'open', done);
});
/**********************/


/*

 //конфиг для nginx
 server {
 listen       81;
 server_name  markup.developer.modulbank.ru;

 #charset koi8-r;

 #access_log  logs/host.access.log  main;

 set $my_host "markup.developer.modulbank.ru";

 location / {
 proxy_pass http://markup.developer.modulbank.ru:4011;
 port_in_redirect off;
 proxy_cache off;
 add_header Cache-controll no-cache;
 }
 }

 */