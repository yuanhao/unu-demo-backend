function updateSize() {
    var viewportWidth = $(window).width();
    var viewportHeight = $(window).height();
    $("#map").css("width", viewportWidth).css("height", viewportHeight);
}

function addLocation(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    window.geocoder.geocode({'latLng': latlng}, 
        function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var add= results[0].formatted_address ;
                    var  value=add.split(",");

                    count=value.length;
                    country=value[count-1];
                    state=value[count-2];
                    city=value[count-3];

                    $.post("stores", { storeName: "Store " + city, storeLat: lat, storeLon: lng }, function(data) {
                        if (JSON.parse(data)['status'] == 200) {
                            var marker = new google.maps.Marker({
                                position: latlng,
                                icon: 'images/logo_unu.png',
                                title: "Store " + city,
                            });
                            marker.setMap(window.map);
                        }
                    });

                }
            }
        }
    );
}

function initMap() {
    var mapAttrs = {
        center:new google.maps.LatLng(51.508742,-0.120850),
        zoom:5,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    window.map = new google.maps.Map(document.getElementById("map"), mapAttrs);
    window.geocoder = new google.maps.Geocoder();
    google.maps.event.addListener(window.map, 'click', function(event) {
        var r = confirm("Add this location? ");
        if (r == true ) {
            var latitude = event.latLng.lat();
            var longitude = event.latLng.lng();
            addLocation(latitude, longitude);
        }
    });
}

function initStoreLocations() {
    $.get("stores", function(data) {
        var storeList = data["storeList"];
        for (var key in storeList) {
            var storeName = key;
            var storeLat = parseFloat(storeList[key]['lat']);
            var storeLon = parseFloat(storeList[key]['lon']);

            var loc = new google.maps.LatLng(storeLat, storeLon);
            var marker = new google.maps.Marker({
                position: loc,
                icon: 'images/logo_unu.png'
            });
            marker.setMap(window.map);
        }
    });
}

function initSocketIo() {
    var socket = io();

    $("#chat").keyup(function(e) {
        if(e.keyCode == 13)
        {
            socket.emit('chat message', $('#chat').val());
            $('#chat').val('');
        }
    });

    socket.on('chat message', function(msg){
        var msgWithTime = msg + " <span class='timestamp'>(" + new Date().toLocaleString() + ")</span>";
        $('#messages').prepend($('<li>').html(msgWithTime));
    });
}

$(window).load(function() {
    updateSize();
    initMap();
    initStoreLocations();
    initSocketIo();
});

$(window).resize(function() {
    updateSize();
});
