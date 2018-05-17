var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: {lat: 37.45, lng: -122.16}
  });

  map.data.loadGeoJson('geodata.json');
}