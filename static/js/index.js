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
        icon: "../static/icons/red-icon.png",
        twitter: cafe.twitter_id,
        location: cafe.coords.lat + "," + cafe.coords.lng
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

            $.ajax({
                url: '/api/get/place',
                dataType: 'json',
                data: { "term": marker.title, "location": marker.location},
                success: function(json) {
                    var content = infowindow.getContent()
                    var image = '<br><img height="100" width="100" src="' + json.businesses[0].image_url + '">'
                    var rating = '<br><div><b>Rating:</b> ' + json.businesses[0].rating + ' (based on ' + json.businesses[0].review_count + ' reviews)</div>'
                    var price = '<div><b>Price:</b> ' + json.businesses[0].price + '</div>'
                    var yelp = '<div><a href="' + json.businesses[0].url + '">Go to Yelp</a></div>'
                    infowindow.setContent(content + image + rating + price + yelp)
                }
            }); 
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

triggerClickOnMarker = function (name) {
    var clicked;
    for (i = 0; i < mapMarkers.length; i++) {
        marker = mapMarkers[i];
        if (marker.title == name) {
            clicked = marker;
            google.maps.event.trigger(marker, 'click', {});
        }
    }
}
try {
    initializeMap();
} catch (err) {
    console.log()
}
