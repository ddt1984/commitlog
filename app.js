var express = require('express');
var http = require('http');
var CommitLog = require('./commitlog').CommitLog;

var app = express();
var server = http.createServer(app);
var io = require("socket.io").listen(server);
var commitLog = new CommitLog();

app.configure(function() {
    app.use(express.bodyParser());
});

app.get('/', function(req, res){
    res.sendfile("commitlog.html");
});

io.sockets.on('connection', function(socket){
    socket.on('search', function(data){
        if (data.query === null || data.query.length < 2) {
            socket.emit('search', {query:data.query, results:[]});
            return;
        }

        commitLog.searchLogs(data.query, function(err, docs) {
            socket.emit('search', {query:data.query, results:docs});
        });
    });
});

if (!module.parent) {
    server.listen(3000);
}