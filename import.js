var async = require('async');
var CommitLog = require('./commitlog').CommitLog;

if (process.argv.length != 4) {
    console.log("usage: node import.js --url=<github url> <git path>");
    process.exit(0);
}
var url = process.argv[2].split("=")[1];
var git_path = process.argv[3];
var command = 'cd ' + git_path + ';git log --pretty=oneline';

var exec = require('child_process').exec;

exec(command, function (err, stdout, stderr) {
    var lines = stdout.split('\n');
    var tasks = [];
    for (var i = 0; i < lines.length; i++) {
        if (lines[i] === null || lines[i].length === 0) continue;

        var cl = new CommitLog();
        cl.commit = lines[i].substring(0, lines[i].indexOf(' '));
        cl.log = lines[i].substring(lines[i].indexOf(' ')+1);
        cl.url = url;
        cl.createKeywords();

        tasks.push(function(cl) {
            return function(callback) {
                //TODO: check exists
                cl.save(function(err, data) {
                    callback(err);
                });
            }
        }(cl));
    }
    async.series(tasks, function(err, results) {
        if (err) console.log(err);
        process.exit(0);
    })
});