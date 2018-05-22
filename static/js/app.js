var cafeData = [
    {
        name: "Cafe Cesura",
        milk: "oat, almond, coconut, hemp, soy",
        coords: {lat:47.619603, lng:-122.196805},
        twitter_id: "CafeCesura",
        description: "Single-origin coffees, loose-leaf teas & creative sandwiches offered in a cool, clean-lined cafe."
    },
    {
        name: "Bellden Cafe",
        milk: "oat, almond, soy",
        coords: {lat:47.610007, lng:-122.199575},
        description: "Bellden Cafe, located in downtown Bellevue, serves specialty coffee & tea and artisanal food. We know that life is chaotic so be kind to yourself."
    },
    {
        name: "Third Culture Coffee",
        milk: "oat, soy",
        coords: {lat:47.61089, lng:-122.203949},
        description: "Stylish coffee shop featuring hot & cold brews, tea, light eats & eclectic global decor."
    },
    {
        name: "Caffe Ladro",
        milk: "almond, soy",
        coords: {lat:47.613389, lng:-122.1971},
        description: "Contemporary local coffeehouse chain featuring sustainable beans plus pastries & other baked goods."
    },
    {
        name: "Fika House Kafe",
        milk: "oat, almond, coconut, soy, hemp",
        coords: {lat:47.612743, lng:-122.198613},
        description: "At Fika House Kafe, enjoy the sweet smell of authentic Belgian waffles seasonally driven and chef-perfected. Savor your coffee's journey from farm to Fika House"
    },
    {
        name: "Caffe Umbria",
        milk: "soy, almond",
        coords: {lat:47.629949, lng:-122.341634},
        description: "Upmarket espresso plus panini & pastries in a European-style cafe setting with outdoor tables."
    },
    {
        name: "Herkimer Coffee",
        milk: "soy, almond",
        coords: {lat:47.627248, lng:-122.342578},
        description: "Contemporary coffeehouse with casual seating, offering house blends & retail beans."
    },
    {
        name: "Starbucks Reverve",
        milk: "soy, coconut, almond",
        coords: {lat:47.614002, lng:-122.328433},
        description: "Seattle-based coffeehouse chain known for its signature roasts, light bites and WiFi availability."
    },
    {
        name: "Fonte Coffee Roaster",
        milk: "soy, almond",
        coords: {lat:47.617581, lng:-122.200149},
        description: "Shop the freshest hand roasted speciality coffee, coffee and tea subscriptions, buy coffee and tea online, visit our cafes in Seattle and Bellevue."
    }

]

var cafeJS = {};

var Cafe = function (data) {
    this.name = ko.observable(data.name);
    this.milk = ko.observable(data.milk);
    this.coords = ko.observable(data.coords);
    this.description = ko.observable(data.description);
}

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
    this.currentCafe = ko.observable(this.filteredCafe()[0]);
    this.setCafe = function (clickedCafe) {
        self.currentCafe(clickedCafe);
    };
    this.getFilteredCafe = function() {
        return this.filteredCafe;
    }
    cafeJS = ko.toJS(self.filteredCafe)
};

ko.applyBindings(new ViewModel());