
function loadYelpDataForCafe(cafe, loaded) {

    $.ajax({
        // request data from backend
        url: '/api/get/place',
        dataType: 'json',
        data: { "term": cafe.name, "location": cafe.coords.lat + ',' + cafe.coords.lng },
        success: function (json) {

            // if json contains businesses, add data to infowindow
            if (json.businesses[0]) {
                imageUrl = json.businesses[0].image_url ? json.businesses[0].image_url : null;
                rating = json.businesses[0].rating ? json.businesses[0].rating : null;
                reviewCount = json.businesses[0].review_count ? json.businesses[0].review_count : null;
                price = json.businesses[0].price ? json.businesses[0].price : null;
                yelpUrl = json.businesses[0].url ? json.businesses[0].url : null;

                yelpData = {
                    imageUrl: imageUrl,
                    rating: rating,
                    reviewCount: reviewCount,
                    price: price,
                    yelpUrl: yelpUrl
                };

                loaded(yelpData);
            }
        },
        error: function() {
            console.log('yelp is not available')
        }
    });
}