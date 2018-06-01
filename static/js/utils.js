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