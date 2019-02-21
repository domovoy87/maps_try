const redGeo = {
    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
    fillColor: '#E63244',
    fillOpacity: 1,
    scale: 0.8,
    strokeColor: 'black',
    strokeWeight: 1
};
const greenGeo = {
    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
    fillColor: '#78DBE2',
    fillOpacity: 1,
    scale: 1,
    strokeColor: 'black',
    strokeWeight: 0.5
};
const goldGeo = {
    path: 'M 0,0 -1,-2 V -43 H 1 V -2 z M 1,-40 H 30 V -20 H 1 z',
    fillColor: 'gold',
    fillOpacity: 1,
    scale: 0.8,
    strokeColor: 'black',
    strokeWeight: 1
};

const ID = () => { return '_' + Math.random().toString(36).substr(2, 9) };

const CenterControl = (controlDiv, map) => {
    const controlUI = document.querySelector('.wrap-input');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginRight = '10px';
    controlUI.style.marginTop = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Введите название после чего укажите место на карте';
    controlDiv.appendChild(controlUI);
};

const createEl = (value, id) => { // функция создания элемента лист айтем
    const listItem = document.createElement('li');
    listItem.setAttribute('id', id);
    setTimeout( () => { listItem.style.opacity = 1 }, 100);
    listItem.classList.add('list_item');
    const paragraph = document.createElement('p');
    paragraph.classList.add('title');
    paragraph.innerHTML = value;
    const btnDel = document.createElement('button');
    btnDel.classList.add('btn', 'btnDel');
    btnDel.innerHTML = '🗑️';
    const btnEdit = document.createElement('button');
    btnEdit.classList.add('btn', 'btnEdit');
    btnEdit.innerHTML = '✏️';
    const btnFav = document.createElement('button');
    btnFav.classList.add('btn', 'btnFav');
    btnFav.innerHTML = '❤️';
    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap-btn');
    listItem.appendChild(paragraph);
    listItem.appendChild(wrapDiv);
    wrapDiv.appendChild(btnDel);
    wrapDiv.appendChild(btnEdit);
    wrapDiv.appendChild(btnFav);
    markerList.appendChild(listItem);
};

const hasMarkers = () => {
    saveMarkers.forEach( item => {
        const pos = {
            lat: item.lat,
            lng: item.lng
        };
        const marker = new google.maps.Marker({
            position: pos,
            map: map,
            id: item.id,
            title: item.title,
            icon: item.icon
        });
        marker.infowindow = new google.maps.InfoWindow({
            position: pos,
            content: item.title
        });
        marker.addListener('click', () => { marker.infowindow.open(map, marker);
        });
        markers.push(marker);
    });

    const btnFav = $('.btnFav');
    const liEl = $('.list_item');
    const favValueArr = saveMarkers.map( item => { return item.isFav === true });

    for (let i = 0; i < $('.btnFav').length; i++) {
        if (favValueArr[i] === true) {
            btnFav[i].classList.add('favourite');
            liEl[i].classList.add('list_item-favourite');
        };
    };
    const favourite = document.querySelectorAll('.favourite');
    favourite.forEach( item => { item.innerHTML = '💔' });
};

const handleLocationError = (browserHasGeolocation, youHereWindow, pos) => { // функция помощник для геолокации
    youHereWindow.setPosition(pos);
    youHereWindow.setContent(browserHasGeolocation ? `Ошибка: Невозможно определить геолокацию` : `Ошибка: Ваш браузер не поддерживает геолокацию`);
    youHereWindow.open(map);
};

const saveMarker = () => { // сохранение в локал сторадж
    let markersJSON = JSON.stringify(saveMarkers); //сериализуем его
    localStorage.setItem("markers", markersJSON); //запишем его в хранилище по ключу "myKey"
}

const createListItemWithId = () => { // функция создания list item с id
    for (let i = saveMarkers.length; i < saveMarkers.length + 1; i++) {
        createEl(text.value, saveMarkers[i - 1].id);
    };
};

const checkGeoLocation = () => { // функция проверки геолокации
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            let myGeoMarker = new google.maps.Marker({
                position: pos,
                map: map,
                animation: google.maps.Animation.DROP,
                icon: 'assets/img/imhere.png'
            });

            const toggleBounce = () => {
                myGeoMarker.getAnimation() !== null ? myGeoMarker.setAnimation(null) : myGeoMarker.setAnimation(google.maps.Animation.BOUNCE);
            };

            youHereWindow.setPosition(pos);
            youHereWindow.setContent('Вы здесь :)');
            myGeoMarker.addListener('click', toggleBounce);
            myGeoMarker.addListener('click', () => { youHereWindow.open(map, myGeoMarker) });
            map.setCenter(pos);
            map.zoom = 13;
            youHereWindow.setPosition(pos);
            youHereWindow.setContent('Вы здесь :)');
            youHereWindow.open(map, myGeoMarker);
            map.setCenter(pos);
        }, () => { handleLocationError(true, youHereWindow, map.getCenter()) });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, youHereWindow, map.getCenter());
    };
};

const createNewMarker = () => { // функция создания маркера по клику
    google.maps.event.addListener(map, 'click', event => {
        if (text.value) {
            addMarker(event.latLng, map, text.value);
            saveMarker();
            createListItemWithId();
            onListItemMouse();
            text.value = '';
        };
    });
};

const addMarker = (location, map, value) => { // функция помощник создания маркера
    let marker = new google.maps.Marker({
        position: location,
        id: ID(),
        map: map,
        icon: redGeo,
        title: value,
        InfoWindow: value,
        animation: google.maps.Animation.DROP
    });

    marker.infowindow = new google.maps.InfoWindow({
        content: value
    });

    saveMarkers.push({
        lat: marker.position.lat(),
        lng: marker.position.lng(),
        title: value,
        id: marker.id,
        icon: redGeo,
        isFav: false
    });
    markers.push(marker)
    marker.addListener('click', () => { marker.infowindow.open(map, marker) });
};

function renderHtml() { // функция рендера странички
    saveMarkers.forEach( item => { createEl(item.title, item.id) });
};