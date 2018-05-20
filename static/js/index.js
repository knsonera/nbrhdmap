var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: { lat: 47.62, lng: -122.27 }
    });

    var redIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    var greenIcon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';

    var coffeeshops = cafeData;
    coffeeshops.forEach(cafe => {
        var infowindow = new google.maps.InfoWindow({
            content: '<b>' + cafe.name + '</b><br/>' + cafe.description,
            maxWidth: 200
        });
        var marker = new google.maps.Marker({
            position: cafe.coords,
            map: map,
            title: cafe.name,
            animation: google.maps.Animation.DROP,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });
        marker.addListener('click', toggleBalloon);
        marker.addListener('click', toggleBounce);
        infowindow.addListener('closeclick', function() {
            if (marker.getIcon() == greenIcon) {
                marker.setIcon(redIcon)
            }
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
              }
        })

        function toggleBounce() {
            if (marker.getAnimation() !== null) {
              marker.setAnimation(null);
            } else {
              marker.setAnimation(google.maps.Animation.BOUNCE);
            }
          }
        function toggleBalloon() {
            if (infowindow.isOpen()) {
                infowindow.close();
                marker.setIcon(redIcon)
            } else {
                infowindow.open(map, marker);
                marker.setIcon(greenIcon)
            }
        }
    });
    map.fit;

    google.maps.InfoWindow.prototype.isOpen = function(){
        var map = this.getMap();
        return (map !== null && typeof map !== "undefined");
    }
}