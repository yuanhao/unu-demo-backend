var redis = require('redis');
var client = redis.createClient();
client.on('connect', function() {
    console.log('connected');
});

exports.findAll = function(req, res) {
    res.writeHead(200, {"Content-Type": "application/json"});

    client.hgetall("storelocations", function (err, objs) {
        var objKeys = Object.keys(objs);
        var storesInfo = {};
        for (var i=0; i < objKeys.length; i++) {
            var storeName = objKeys[i];
            var storeLocLat = JSON.parse(objs[storeName])['lat'];
            var storeLocLon = JSON.parse(objs[storeName])['lon'];
            storesInfo[storeName] = { 'lat': storeLocLat, 'lon': storeLocLon };
        }

        var json = JSON.stringify({
            storeList: storesInfo,
        });
        res.end(json);
    });
};

exports.add = function(req, res) {
    var store = req.body;

    var storeName = store['storeName'];
    var storeLat = store['storeLat'];
    var storeLon = store['storeLon'];

    client.hmset("storelocations", [storeName, '{ "lat": "' + storeLat + '", "lon": "' + storeLon + '"}'], function(e, r) {
        console.log(r);
    });

    var response = {
        status  : 200,
        success : 'Added Successfully'
    };
    res.end(JSON.stringify(response));
};

