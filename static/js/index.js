var map;
var infowindow;

var mapMarkers = [];

var coffeeshops = {};
var currentMarker;

// create Map, InfoWindow object add markers to the map

function initializeMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: 47.62, lng: -122.27 },
        styles: mapStyle
    });
    infowindow = new google.maps.InfoWindow({
        content: '',
        maxWidth: 250
    });
    setTimeout(function() {
        coffeeshops = cafeJS;
        for (i = 0; i < coffeeshops.length; i++) {
            addMarker(coffeeshops[i]);
        }
    }, 1000)
    
}

// create markers with custom attributes

function addMarker(cafe) {

    var content = '<b>' + cafe.name + '</b><br/>' + cafe.description;

    var marker = new google.maps.Marker({
        position: cafe.coords,
        map: map,
        title: cafe.name,
        milk: cafe.milk,
        animation: google.maps.Animation.DROP,
        icon: "/static/icons/red-icon.png",
        location: cafe.coords.lat + "," + cafe.coords.lng
    });

    // add markers to the map
    mapMarkers.push(marker);

    // add click listener
    google.maps.event.addListener(marker, 'click', (function (marker, content) {
        return function () {
            // change current marker icon color to red
            if (currentMarker) {
                currentMarker.setIcon("/static/icons/red-icon.png");
            }
            // set marker color to green
            marker.setIcon("/static/icons/green-icon.png");

            // remember current marker
            currentMarker = marker;

            // set infowindow content and open infowindow
            infowindow.setContent(content);
            infowindow.open(map, marker);

            var initialContent = infowindow.getContent();

            loadYelpDataForCafe(
                marker.title,
                marker.location,
                function(data) {
                    // avoid multiple objects in infowindow
                    if (initialContent != infowindow.getContent()) {
                        return;
                    }
                    // change infowindow content based on data from yelp
                    if (data) {
                        // data received
                        if (data.available) {
                            // place found on yelp
                            var image = '';
                            var rating = '';
                            var price = '';
                            var yelp = '';
                            if (data.imageUrl) {
                                image = '<br><img height="100" width="100" src="'
                                        + data.imageUrl + '">';
                            }
                            if (data.rating) {
                                rating = '<br><div><b>Rating:</b> ' +
                                        data.rating +
                                        ' (based on ' +
                                        data.reviewCount +
                                        ' reviews)</div>';
                            }
                            if (data.price) {
                                price = '<div><b>Price:</b> ' +
                                        data.price + '</div>';
                            }
                            if (data.yelpUrl) {
                                yelp = '<div><a href="' + data.yelpUrl +
                                    '">Provided by Yelp.com</a></div>';
                            }
                            // add yelp data to infowindow
                            infowindow.setContent(initialContent + image + 
                                                  rating + price + yelp);
                        } else {
                            // place not found on yelp
                            var notfound = '<br><br><div>(Sorry, this place is \
                                            not found on Yelp.\
                                            Rating, photos and prices are not \
                                            available.)\
                                            <a href="http://www.yelp.com" \
                                            target="blank">www.yelp.com</a>\
                                            </div>';
                            infowindow.setContent(initialContent + notfound);
                        }
                    } else {
                        // data from yelp is not available
                        var nodata = '<br><br><div>\
                                      (Sorry, Yelp is not responding. \
                                      Rating, photos and prices are not \
                                      available at this time.)\
                                      <a href="http://www.yelp.com" \
                                      target="blank">www.yelp.com</a></div>';
                        infowindow.setContent(initialContent + nodata);
                    }
                }
            );

            // highlight coffee shop clicked on the map in the sidebar
            _viewModel.highlightCafe(marker.title);

        }
    })(marker, content));

    // change icon color if user closes infowindow
    google.maps.event.addListener(infowindow, 'closeclick', (function () {
        return function () {
            currentMarker.setIcon('/static/icons/red-icon.png');
        }
    })());

    // if marker is not visible, close infowindow and change icon color
    google.maps.event.addListener(marker, 'visible_changed', (function (marker){
        return function () {
            infowindow.close();
            if (currentMarker) {
                currentMarker.setIcon('/static/icons/red-icon.png');
            }
        }
    })(marker));
}

// filter markers on the map
filterMarkers = function (milk) {
    if (typeof google === 'object' && typeof google.maps === 'object') {
        for (i = 0; i < mapMarkers.length; i++) {
            marker = mapMarkers[i];
            var match = marker.milk.indexOf(milk) != -1 || milk == "All";
            marker.setVisible(match);
        }
    }
}

// google maps api is not available
gmapsError = function () {
    alert("Sorry, Google Maps API is not available. Map will not be shown.");
}

var mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ];

// add map to the dom
try {
    initializeMap();
} catch (err) {
    console.log();
}

