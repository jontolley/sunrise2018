let map;

window.initMap = function initMap() {
    if (!document.getElementById('direction-map')) return;

    map = new google.maps.Map(document.getElementById('direction-map'), {
        center: { lat: 48.122341, lng: -117.236857 },
        mapTypeId: 'satellite',
        zoom: 16,
    });

    const parkingLotMarker = new google.maps.Marker({
        position: { lat: 48.120032, lng: -117.236783 },
        title: 'Parking Lot',
        label: {
            text: 'Parking Lot',
            color: 'white',
        },
    });

    const campMarker = new google.maps.Marker({
        position: { lat: 48.124032, lng: -117.237300 },
        title: 'Camp Sunrise',
        label: {
            text: 'Camp Sunrise',
            color: 'white',
        },
    });

    parkingLotMarker.setMap(map);
    campMarker.setMap(map);
};

