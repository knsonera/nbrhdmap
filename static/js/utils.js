function loadYelpDataForCafe(name, location, loaded) {
    $.ajax({
        url: '/api/get/place',
        dataType: 'json',
        data: {"term": name, "location": location},
        success: function (json) {
            if (json.hasOwnProperty('businesses') && json.businesses[0]) {
                var imageUrl = json.businesses[0].image_url || null;
                var rating = json.businesses[0].rating || null;
                var reviewCount = json.businesses[0].review_count || null;
                var price = json.businesses[0].price || null;
                var yelpUrl = json.businesses[0].url || null;

                var yelpData = {
                    available: true,
                    imageUrl: imageUrl,
                    rating: rating,
                    reviewCount: reviewCount,
                    price: price,
                    yelpUrl: yelpUrl
                };

                loaded(yelpData);
            } else {
                var yelpData = {
                    available: false,
                    rating: 'not available',
                    price: 'not available',
                    reviewCount: 0,
                    imageUrl: '',
                    yelpUrl: 'http://www.yelp.com'
                };
                loaded(yelpData);
            }
        },
        error: function () {
            alert('Yelp API is not available. Some information may not be available.');
            loaded(null);
        }
    });
}

function loadCoordsForCafe(name, loaded) {
    $.ajax({
        url: '/api/get/coords',
        dataType: 'json',
        data: {"address": name},
        success: function (json) {
            if (json.hasOwnProperty('results') && json.results[0]) {
                console.log(json.results[0].geometry.location.lat);
                var placeLat = json.results[0].geometry.location.lat
                var placeLng = json.results[0].geometry.location.lng
                var placeAddress = json.results[0].formatted_address

                var result = {
                    lat: placeLat,
                    lng: placeLng,
                    adr: placeAddress
                };

                loaded(result);
            } else {
                var result = {
                    lat: "",
                    lng: "",
                    adr: ""
                };
                loaded(result);
            }
        },
        error: function () {
            alert('Google Maps Geocoding is not available.');
            loaded(null);
        }
    });
}

function fetchCoords() {
    var name = document.getElementById("newCafeName").value
    console.log(name)
    loadCoordsForCafe(name, function(data) {
        if (data.hasOwnProperty('lat') && data.hasOwnProperty('lng')) {
            document.getElementById("newCafeLat").value = data.lat
            document.getElementById("newCafeLng").value = data.lng
            document.getElementById("newCafeDesc").value = "Address: " + data.adr
        }
    })
}

function loadAllCafes(loaded) {
    $.ajax({
        url: '/cafes/JSON',
        dataType: 'json',
        success: function (json) {
            if (json.hasOwnProperty('Cafes') && json.Cafes[0]) {
                loaded(json.Cafes);
            }
        },
        error: function () {
            alert('Data is not available. Try again later');
            loaded([]);
        }})
}