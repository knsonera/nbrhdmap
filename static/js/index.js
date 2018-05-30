var map;
var infowindow;

var mapMarkers = [];

var coffeeshops = cafeJS;
var currentMarker;

var noMapDataElement;

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

    marker = new google.maps.Marker({
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

            // Yelp data about the place
            // TODO: show information on the page even if map is not available
            $.ajax({
                // request data from backend
                url: '/api/get/place',
                dataType: 'json',
                data: { "term": marker.title, "location": marker.location },
                success: function (json) {
                    var content = infowindow.getContent()
                    // if json contains businesses, add data to infowindow
                    if (json.businesses[0]) {
                        var image = '';
                        var rating = '';
                        var price = '';
                        var yelp = '';
                        if (json.businesses[0].image_url) {
                            image = '<br><img height="100" width="100" src="' + json.businesses[0].image_url + '">'
                        }
                        if (json.businesses[0].rating) {
                            rating = '<br><div><b>Rating:</b> ' + json.businesses[0].rating + ' (based on ' + json.businesses[0].review_count + ' reviews)</div>'
                        }
                        if (json.businesses[0].price) {
                            price = '<div><b>Price:</b> ' + json.businesses[0].price + '</div>'
                        }
                        if (json.businesses[0].url) {
                            yelp = '<div><a href="' + json.businesses[0].url + '">Go to Yelp</a></div>'
                        }
                        // add yelp data to infowindow
                        infowindow.setContent(content + image + rating + price + yelp)
                    } else {
                        var nodata = '<br><div></div>'
                        infowindow.setContent(content + nodata)
                    }

                }
            });

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
    google.maps.event.addListener(marker, 'visible_changed', (function (marker) {
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

// trigger click on the marker if user clicks on list item
triggerClickOnMarker = function (name) {
    if (typeof google === 'object' && typeof google.maps === 'object') {
        var clicked;
        for (i = 0; i < mapMarkers.length; i++) {
            marker = mapMarkers[i];
            if (marker.title == name) {
                clicked = marker;
                google.maps.event.trigger(marker, 'click', {});
            }
        }
    } else {
        var loc = "47.62,-122.27";
        noMapDataElement = '';
        highlightItem(name);
        $.ajax({
            // request data from backend
            url: '/api/get/place',
            dataType: 'json',
            data: { "term": name, "location": loc },
            success: function (json) {
                // if json contains businesses, add data to infowindow
                if (json.businesses[0]) {
                    var image = '<br><img height="100" width="100" src="../static/pics/coffee-placeholder.jpg">';
                    var rating = '<br><div><b>Rating:</b> (based on reviews)</div>';
                    var price = '<div><b>Price:</b></div>';
                    var yelp = '<div><a href="">Go to Yelp</a></div>';
                    if (json.businesses[0].image_url) {
                        image = '<br><img height="100" width="100" src="' + json.businesses[0].image_url + '">';
                    }
                    if (json.businesses[0].rating) {
                        rating = '<br><div><b>Rating:</b> ' + json.businesses[0].rating + ' (based on ' + json.businesses[0].review_count + ' reviews)</div>';
                    }
                    if (json.businesses[0].price) {
                        price = '<div><b>Price:</b> ' + json.businesses[0].price + '</div>';
                    }
                    if (json.businesses[0].url) {
                        yelp = '<div><a href="' + json.businesses[0].url + '">Go to Yelp</a></div>';
                    }
                    // add yelp data to infowindow
                    noMapDataElement = image + rating + price + yelp;
                } else {
                    var nodata = '<br><div></div>';
                    noMapDataElement = nodata;
                }
                document.getElementById('yelp').createTextNode = noMapDataElement;
            },
            error: function() {
                var nodata = 'No data from Yelp.com is available at this time.'
                noMapDataElement = nodata;
                //document.getElementById('yelp').createTextNode = noMapDataElement;
            }
        });

        try {
            document.getElementById("cafe").removeClass('map-loaded');
        } catch(e) {
            console.log();
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

