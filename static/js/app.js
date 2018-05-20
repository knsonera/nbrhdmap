var cafeData = [ 
    {
        name: "Cafe Cesura",
        milk: "oat, almond",
        food: "breakfast",
        hours: "until 7pm"
    },
    {
        name: "Bellden Cafe",
        milk: "oat, almond",
        food: "breakfast, lunch",
        hours: "until 7pm"
    },
    {
        name: "Third Culture Coffee",
        milk: "oat",
        food: "breakfast, lunch",
        hours: "until 9pm"
    },
    {
        name: "Caffe Ladro",
        milk: "almond",
        food: "breakfast",
        hours: "until 7pm"
    },
    {
        name: "Fika House Kafe",
        milk: "oat, almond",
        food: "breakfast",
        hours: "until 7pm"
    },
    {
        name: "Caffe Umbria",
        milk: "almond",
        food: "breakfast, lunch",
        hours: "until 7pm"
    },
    {
        name: "Herkimer Coffee",
        milk: "",
        food: "breakfast",
        hours: "until 7pm"
    },
    {
        name: "Starbucks",
        milk: "almond",
        food: "breakfast, lunch",
        hours: "until midnight"
    }

]

var Cafe = function(data) {
    this.name = ko.observable(data.name);
    this.milk = ko.observable(data.milk);
    this.food = ko.observable(data.food);
    this.hours = ko.observable(data.hours);
}

var ViewModel = function() {
    var self = this;

    this.cafeList = ko.observableArray([]);
    cafeData.forEach(function(cafeItem) {
        self.cafeList.push( new Cafe(cafeItem) );
    })
    this.currentCafe = ko.observable( this.cafeList()[0] );
    this.setCafe = function(clickedCafe) {
        self.currentCafe(clickedCafe);
    };
};

ko.applyBindings(new ViewModel());