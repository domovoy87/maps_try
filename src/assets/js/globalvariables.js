let map, youHereWindow, centerControl;
const markers = [];
const saveMarkers = JSON.parse(localStorage.getItem('markers')) || [];
const text = document.querySelector('.inputText');
const markerList = document.querySelector('.markerList');
const mapElement = document.getElementById('map');
const liEl = document.getElementsByClassName('list_item');