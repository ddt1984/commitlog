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
    var reArray = [];
    var words = query.split(" ");
    words.forEach(function(word) {
        if (word.length < 3) return; //too short

        reArray.push({keywords : new RegExp(word, "i")});
    });

    CommitLog.find({ $and:reArray}, callback);
};

CommitLog.prototype.createKeywords = function() {
    if (this.log === null || this.log.length == 0) return;
    this.keywords = this.log.split(' ').filter(function(item) {
        return item.length >= 3;
    });
}

exports.CommitLog = CommitLog;