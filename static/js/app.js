var cafeData = [
    {
        name: "Cafe Cesura",
        milk: "oat, almond, coconut, hemp, soy"
    },
    {
        name: "Bellden Cafe",
        milk: "oat, almond, soy"
    },
    {
        name: "Third Culture Coffee",
        milk: "oat, soy"
    },
    {
        name: "Caffe Ladro",
        milk: "almond, soy"
    },
    {
        name: "Fika House Kafe",
        milk: "oat, almond, coconut, soy, hemp"
    },
    {
        name: "Caffe Umbria",
        milk: "soy, almond"
    },
    {
        name: "Herkimer Coffee",
        milk: "soy, almond"
    },
    {
        name: "Starbucks",
        milk: "soy, coconut, almond"
    }

]

var Cafe = function (data) {
    this.name = ko.observable(data.name);
    this.milk = ko.observable(data.milk);
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
};

ko.applyBindings(new ViewModel());