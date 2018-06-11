var cafeJS = {};

var cafes = [];
cafes = loadAllCafes(function (cafeData) {

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

        // show trash icon only if list is not empty
        // TODO: add visible bindings to show/hide trash icon
        self.showDeleteIcon = ko.observable(false);
        if (cafeData.length == 0) {
            self.showDeleteIcon(false);
        }

        self.getFilteredCafe = function () {
            return self.filteredCafe;
        }
        cafeJS = ko.toJS(self.filteredCafe);

    };

    _viewModel = new ViewModel();
    ko.applyBindings(_viewModel);
});

