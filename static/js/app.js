var cafeData = [
    {
        name: "Cafe Cesura",
        milk: "oat, almond, coconut, hemp, soy",
        coords: { lat: 47.619603, lng: -122.196805 },
        description: "Single-origin coffees, loose-leaf teas & creative \
                      sandwiches offered in a cool, clean-lined cafe.",
        yelpData: null
    },
    {
        name: "Bellden Cafe",
        milk: "oat, almond, soy",
        coords: { lat: 47.610007, lng: -122.199575 },
        description: "Bellden Cafe, located in downtown Bellevue, serves \
                      specialty coffee & tea and artisanal food. We know that \
                      life is chaotic so be kind to yourself.",
        yelpData: null
    },
    {
        name: "Third Culture Coffee",
        milk: "oat, soy",
        coords: { lat: 47.61089, lng: -122.203949 },
        description: "Stylish coffee shop featuring hot & cold brews, tea, \
                      light eats & eclectic global decor.",
        yelpData: null
    },
    {
        name: "Caffe Ladro",
        milk: "almond, soy",
        coords: { lat: 47.613389, lng: -122.1971 },
        description: "Contemporary local coffeehouse chain featuring \
                      sustainable beans plus pastries & other baked goods.",
        yelpData: null
    },
    {
        name: "Fika House Kafe",
        milk: "oat, almond, coconut, soy, hemp",
        coords: { lat: 47.612743, lng: -122.198613 },
        description: "At Fika House Kafe, enjoy the sweet smell of authentic \
                      Belgian waffles seasonally driven and chef-perfected. \
                      Savor your coffee's journey from farm to Fika House",
        yelpData: null
    },
    {
        name: "Caffe Umbria",
        milk: "soy, almond",
        coords: { lat: 47.629949, lng: -122.341634 },
        description: "Upmarket espresso plus panini & pastries in \
                      a European-style cafe setting with outdoor tables.",
        yelpData: null
    },
    {
        name: "Herkimer Coffee",
        milk: "soy, almond",
        coords: { lat: 47.627248, lng: -122.342578 },
        description: "Contemporary coffeehouse with casual seating, offering \
                      house blends & retail beans.",
        yelpData: null
    },
    {
        name: "Starbucks Reverve",
        milk: "soy, coconut, almond",
        coords: { lat: 47.614002, lng: -122.328433 },
        description: "Seattle-based coffeehouse chain known for its signature \
                      roasts, light bites and WiFi availability.",
        yelpData: null
    },
    {
        name: "Fonte Coffee Roaster",
        milk: "soy, almond",
        coords: { lat: 47.617581, lng: -122.200149 },
        description: "Shop the freshest hand roasted speciality coffee, \
                      coffee and tea subscriptions, buy coffee and tea online,\
                      visit our cafes in Seattle and Bellevue.",
        yelpData: null
    }

]

var cafeJS = {};

var ViewModel = function () {
    var self = this;

    self.selectedMilk = ko.observable("All");

    self.filteredCafe = ko.computed(function () {
        var milk = self.selectedMilk();
        if (milk === "All") {
            return cafeData;
        } else {
            var tempList = cafeData.slice();
            var result = tempList.filter(function (cafe) {
                cafeMilk = cafe.milk;
                return cafeMilk.indexOf(milk) != -1
            });
            return result;
        }
    });

    this.currentCafe = ko.observable( this.filteredCafe()[0] );

    this.selectCafe = function(cafe) {
        loadYelpDataForCafe(cafe, function(data) {
            cafe.yelpData = {
                imageUrl: data.imageUrl,
                rating: data.rating,
                reviewCount: data.reviewCount,
                price: data.price,
                yelpUrl: data.yelpUrl
            };
            self.currentCafe(cafe);
        });
    }

    var firstCafe = this.filteredCafe()[0];
    //this.selectCafe(firstCafe);
    loadYelpDataForCafe(firstCafe, function(data) {
        firstCafe.yelpData = {
            imageUrl: data.imageUrl,
            rating: data.rating,
            reviewCount: data.reviewCount,
            price: data.price,
            yelpUrl: data.yelpUrl

        };
        self.currentCafe(firstCafe);
    });

    this.setCafe = function(clickedCafe) {
        // load data from yelp for clickedCafe
        self.currentCafe(clickedCafe);
        loadYelpDataForCafe(clickedCafe, function(data) {
            clickedCafe.yelpData = {
                imageUrl: data.imageUrl,
                rating: data.rating,
                reviewCount: data.reviewCount,
                price: data.price,
                yelpUrl: data.yelpUrl
            };
            self.currentCafe(clickedCafe);
        });
    };

    this.getFilteredCafe = function () {
        return this.filteredCafe;
    }
    cafeJS = ko.toJS(self.filteredCafe);

};

ko.applyBindings(new ViewModel());