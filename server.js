var redis = require('redis');
var client = redis.createClient();
client.on('connect', function() {
    console.log('connected');
});


var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.static(__dirname + "/public"));
});

io.on('connection', function(socket) {
    console.log("A user connected");
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

var stores = require(__dirname + '/routes/stores');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/stores', stores.findAll);
app.post('/stores', stores.add);

http.listen(3000, function() {
    console.log("Listening on port 3000");
});
