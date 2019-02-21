function initMap() { // инициализируем карту
    map = new google.maps.Map(mapElement, {
        center: {
            lat: 49.01,
            lng: 31.28
        },
        zoom: 2,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: google.maps.ControlPosition.LEFT_TOP
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        fullscreenControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        }
    });
    youHereWindow = new google.maps.InfoWindow;
    const centerControlDiv = document.createElement('div');
    const centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(centerControlDiv);
    
    renderHtml();
    checkGeoLocation();
    createNewMarker();
    hasMarkers();
    onListItemMouse();
    deleteBtn();
    editBtn();
    favBtnAdd();
};



