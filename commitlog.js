var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var CommitLogSchema = new mongoose.Schema({
    log : String,
    keywords : Array,
    commit : String,
    url : String
});

mongoose.model('CommitLog', CommitLogSchema, 'commitlog');
var CommitLog = mongoose.model('CommitLog');
CommitLog.prototype.searchLogs = function(query, callback) {
    var reArray = new Array();
    var words = query.split(" ");
    words.forEach(function(word) {
        if (word.length < 3) return; //too short

        reArray.push({keywords : new RegExp(word, "i")});
    });

    CommitLog.find({ $and:reArray}, callback);
};

exports.CommitLog = CommitLog;

// util functions
function createKeywords(s) {
    if (s === null || s.length == 0) return [];

    var arr = s.split(' ');
    return arr.filter(function(item) {
        return item.length >= 3;
    });
}

var exec = require('child_process').exec;
function fillCommitLogs() {
    exec('cd /Users/ddt/temp/async;git log --pretty=oneline', function (err, stdout, stderr) {
        var lines = stdout.split('\n');
        lines.forEach(function(line) {
            if (line === null || line.length === 0) return;

            var cl = new CommitLog();
            cl.commit = line.substring(0, line.indexOf(' '));
            cl.log = line.substring(line.indexOf(' ')+1);
            //TODO: check exists
            cl.keywords = createKeywords(cl.log);
            cl.url = 'https://github.com/caolan/async/commit/';
            cl.save(function(err, data) {
                if (err) console.log(err);
            });
        });
    });
}


//FIXME: deprecated
function generateKeywords() {
    commitLog.find(function (err, docs) {
        if (err) console.log(err);

        docs.forEach(function (doc) {
            doc.keywords = createKeywords(doc.log);
            doc.save(function (err, data) {
                if (err) console.log(err);
            });
        });
    });
}