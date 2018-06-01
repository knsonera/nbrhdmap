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

    // load data from yelp and change current cafe
    self.fetchSelectedCafeData = function (cafe) {
        if (cafe.yelpData) {
            // cached
            self.currentCafe(cafe);
        } else {
            loadYelpDataForCafe(
                cafe.name,
                cafe.coords.lat + ',' + cafe.coords.lng,
                function (data) {
                    cafe.yelpData = {
                        imageUrl: data.imageUrl,
                        rating: data.rating,
                        reviewCount: data.reviewCount,
                        price: data.price,
                        yelpUrl: data.yelpUrl
                    };
                    self.currentCafe(cafe);
                }
            );
        }
    }

    // no milk option selected by default
    self.selectedMilk = ko.observable("All");

    // generate list of coffee shops based on milk option filter
    self.filteredCafe = ko.computed(function () {
        var milk = self.selectedMilk();
        if (milk === "All") {
            return cafeData;
        } else {
            var tempList = cafeData.slice();
            var result = tempList.filter(function (cafe) {
                cafeMilk = cafe.milk;
                return cafeMilk.indexOf(milk) != -1;
            });
            return result;
        }
    });

    // set currentCafe to first cafe in the list by default
    var firstCafe = self.filteredCafe()[0];
    self.currentCafe = ko.observable(firstCafe);

    // load data for the first cafe
    self.fetchSelectedCafeData(firstCafe);

    // highlight cafe in the sidebar
    self.highlightCafe = function (title) {
        var currentList = self.filteredCafe();
        for (i = 0; i < currentList.length; i++) {
            if (currentList[i].name == title) {
                self.currentCafe(currentList[i]);
            }
        }
    }

    // set currentCafe and generate click on the marker
    self.setCafe = function (clickedCafe) {
        self.currentCafe(clickedCafe);
        if (typeof google === 'object' && typeof google.maps === 'object') {
            for (i = 0; i < mapMarkers.length; i++) {
                var marker = mapMarkers[i];
                if (marker.title == clickedCafe.name) {
                    google.maps.event.trigger(marker, 'click', {});
                    break;
                }
            }
        } else {
            // no Google maps available
            self.fetchSelectedCafeData(clickedCafe);
            // if Google Maps API doesn't work, 
            // show information about clicked item in the DOM
            try {
                document.getElementById("cafe").removeClass('map-loaded');
            } catch (e) {
                console.log();
            }

        }
    };

    // variable and function for toggling sidebar
    self.sidebarOpened = ko.observable(1);
    self.openSidebar = function () {
        self.sidebarOpened(!self.sidebarOpened());
    }

    self.getFilteredCafe = function () {
        return self.filteredCafe;
    }
    cafeJS = ko.toJS(self.filteredCafe);

};

_viewModel = new ViewModel();
ko.applyBindings(_viewModel);