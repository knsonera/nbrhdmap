var map;
var infowindow;

var mapMarkers = [];

var coffeeshops = cafeJS;
var currentMarker;


function initializeMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: { lat: 47.62, lng: -122.27 }
    });
    infowindow = new google.maps.InfoWindow({
        content: '',
        maxWidth: 250
    });
    for (i = 0; i < coffeeshops.length; i++) {
        addMarker(coffeeshops[i]);
    }
}

function addMarker(cafe) {

    var content = '<b>' + cafe.name + '</b><br/>' + cafe.description;

    marker = new google.maps.Marker({
        position: cafe.coords,
        map: map,
        title: cafe.name,
        milk: cafe.milk,
        animation: google.maps.Animation.DROP,
        icon: "../static/icons/red-icon.png"
    });

    mapMarkers.push(marker);

    // Marker click listener
    google.maps.event.addListener(marker, 'click', (function (marker, content) {
        return function () {
            if (currentMarker) {
                currentMarker.setIcon("../static/icons/red-icon.png")
            }
            marker.setIcon("../static/icons/green-icon.png")
            currentMarker = marker;
            infowindow.setContent(content);
            infowindow.open(map, marker);
        }
    })(marker, content));

    google.maps.event.addListener(infowindow, 'closeclick', (function () {
        return function () {
            currentMarker.setIcon('../static/icons/red-icon.png');
        }
    })());

    google.maps.event.addListener(marker, 'visible_changed', (function (marker) {
        return function () {
            infowindow.close();
            if (currentMarker) {
                currentMarker.setIcon('../static/icons/red-icon.png');
            }
        }
    })(marker));
}

filterMarkers = function (milk) {
    for (i = 0; i < mapMarkers.length; i++) {
        marker = mapMarkers[i];
        if (marker.milk.indexOf(milk) != -1 || milk == "All") {
            marker.setVisible(true);
        }
        else {
            marker.setVisible(false);
        }
    }
}

triggerClickOnMarker = function(name) {
    for (i = 0; i < mapMarkers.length; i++) {
        marker = mapMarkers[i];
        if (marker.title == name) {
            google.maps.event.trigger(marker, 'click', {});
        }
    }
}
try {
    initializeMap();
} catch (err) {
    console.log()
}
