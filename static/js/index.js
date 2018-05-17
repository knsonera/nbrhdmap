var map;
function init() {
    map = myMap = new ymaps.Map("map", {
        center: [59.94, 30.30],
        zoom: 10,
        behaviors: ['default', 'scrollZoom'],
        controls: ['rulerControl']
    }, {
            autoFitToViewport: 'always'
        });
    var collection = new ymaps.GeoObjectCollection();

    ymaps.geoXml.load('http://maps.yandex.ru/export/usermaps/TRvYO8yGoCpUP5-CEc8jZIX_oIVwR01R/').then(function (res) {
        map.geoObjects.add(res.geoObjects);
        map.setBounds(map.geoObjects.getBounds());
    });

    var searchControl = new ymaps.control.SearchControl();
    var geoControl = new ymaps.control.GeolocationControl();
    var zoomControl = new ymaps.control.ZoomControl();
    var trafficControl = new ymaps.control.TrafficControl();
    var routeControl = new ymaps.control.RouteEditor();

    map.geoObjects.add(collection);

    map.controls
        .add(searchControl, { floatIndex: 20 })
        .add(geoControl, { float: 'none', position: { bottom: 30, left: 5 } })
        .add(routeControl, { float: 'none', position: { bottom: 65, left: 5 } })
        .add(zoomControl, { size: 'small', float: 'none', position: { bottom: 65, right: 10 } })
        .add(trafficControl, { size: 'large', float: 'right' })

}