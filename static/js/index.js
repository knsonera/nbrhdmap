var map;
var infowindow;

var mapMarkers = [];

var coffeeshops = cafeJS;
var currentMarker;

// create Map, InfoWindow object add markers to the map

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

// create markers with custom attributes

function addMarker(cafe) {

    var content = '<b>' + cafe.name + '</b><br/>' + cafe.description;

    var marker = new google.maps.Marker({
        position: cafe.coords,
        map: map,
        title: cafe.name,
        milk: cafe.milk,
        animation: google.maps.Animation.DROP,
        icon: "../static/icons/red-icon.png",
        location: cafe.coords.lat + "," + cafe.coords.lng
    });

    // add markers to the map
    mapMarkers.push(marker);

    // add click listener
    google.maps.event.addListener(marker, 'click', (function (marker, content) {
        return function () {
            // change current marker icon color to red 
            if (currentMarker) {
                currentMarker.setIcon("../static/icons/red-icon.png")
            }
            // set marker color to green
            marker.setIcon("../static/icons/green-icon.png")

            // remember current marker
            currentMarker = marker;

            // set infowindow content and open infowindow
            infowindow.setContent(content);
            infowindow.open(map, marker);

            loadYelpDataForCafe(
                marker.title, 
                marker.location, 
                function(data) {
                    var content = infowindow.getContent()
                    // if json contains businesses, add data to infowindow
                    if (data && data.available) {
                        var image = '';
                        var rating = '';
                        var price = '';
                        var yelp = '';
                        if (data.imageUrl) {
                            image = '<br><img height="100" width="100" src="'
                                    + data.imageUrl + '">';
                        }
                        if (data.rating) {
                            rating = '<br><div><b>Rating:</b> '
                                     + data.rating
                                     + ' (based on '
                                     + data.reviewCount
                                     + ' reviews)</div>';
                        }
                        if (data.price) {
                            price = '<div><b>Price:</b> '
                                    + data.price + '</div>';
                        }
                        if (data.yelpUrl) {
                            yelp = '<div><a href="' + data.yelpUrl
                                    + '">Go to Yelp</a></div>';
                        }
                        // add yelp data to infowindow
                        infowindow.setContent(content + image + rating
                                              + price + yelp)
                    } else {
                        var nodata = '<br><div></div>'
                        infowindow.setContent(content + nodata)
                    }
                }
            );

            // highlight current marker in the sidebar
            highlightItem(marker.title);

        }
    })(marker, content));

    // change icon color if user closes infowindow
    google.maps.event.addListener(infowindow, 'closeclick', (function () {
        return function () {
            currentMarker.setIcon('../static/icons/red-icon.png');
        }
    })());

    // if marker is not visible, close infowindow and change icon color
    google.maps.event.addListener(marker, 'visible_changed', (function (marker){
        return function () {
            infowindow.close();
            if (currentMarker) {
                currentMarker.setIcon('../static/icons/red-icon.png');
            }
        }
    })(marker));
}

// filter markers on the map 
filterMarkers = function (milk) {
    if (typeof google === 'object' && typeof google.maps === 'object') {
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
}

// add toggler for sidebar/map ratio
initializePage = function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#map').toggleClass('active');
    });
}

// change list item style, if user clicks on the marker
highlightItem = function (item) {
    $('.coffeeshop').css('font-weight', 'normal');
    $('.coffeeshop').css('color', 'teal');
    $('.coffeeshop').css('background-color', 'inherit');
    $('.coffeeshop:contains("' + item + '")').css('font-weight', 'bold');
    $('.coffeeshop:contains("' + item + '")').css('color', '#551A8B');
    $('.coffeeshop:contains("' + item + '")').css('background-color', '#eee');
}

// when dom is ready, add toggler
$(document).ready(initializePage);
if (typeof google == "undefined") {
    highlightItem(coffeeshops[0].name);
}

// add map to the dom
try {
    initializeMap();
} catch (err) {
    console.log()
}

