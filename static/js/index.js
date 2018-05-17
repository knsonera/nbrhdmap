var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: {lat: 37.45, lng: -122.16}
  });

  // NOTE: This uses cross-domain XHR, and may not work on older browsers.
  map.data.loadGeoJson('../static/js/geodata.json');
}