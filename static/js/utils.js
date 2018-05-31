
function loadYelpDataForCafe(name, location, loaded) {
    $.ajax({
        url: '/api/get/place',
        dataType: 'json',
        data: { "term": name, "location": location},
        success: function (json) {
            // if json contains businesses, add data to infowindow
            if (json.businesses[0]) {
                imageUrl = json.businesses[0].image_url 
                           ? json.businesses[0].image_url 
                           : null;
                rating = json.businesses[0].rating ? json.businesses[0].rating : null;
                reviewCount = json.businesses[0].review_count 
                              ? json.businesses[0].review_count : null;
                price = json.businesses[0].price ? json.businesses[0].price : null;
                yelpUrl = json.businesses[0].url ? json.businesses[0].url : null;

                yelpData = {
                    available: true,
                    imageUrl: imageUrl,
                    rating: rating,
                    reviewCount: reviewCount,
                    price: price,
                    yelpUrl: yelpUrl
                };

                loaded(yelpData);
            } else {
                yelpData = {
                    available: false,
                    imageUrl: '../static/pics/coffee-placeholder.jpg'
                };
                loaded(yelpData);
            }
        },
        error: function() {
            yelpData = {
                available: false,
                imageUrl: '../static/pics/coffee-placeholder.jpg'
            };
            loaded(yelpData);
        }
    });
}