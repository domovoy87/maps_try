const onListItemMouse = () => {
    const listItemEl = $('.list_item');
    listItemEl.mouseenter(function() {
        const idListItem = this.id;
        const index = markers.findIndex( item => { return item.id === idListItem })
        if (markers[index] !== undefined) {
            const pos = {
                lat: markers[index].position.lat(),
                lng: markers[index].position.lng()
            }
            markers[index].infowindow.setContent(markers[index].title);
            if (saveMarkers[index].isFav === false) {
                markers[index].setIcon(greenGeo);
                markers[index].infowindow.open(map, markers[index]);
                map.setCenter(pos);
            } else {
                markers[index].setIcon(goldGeo);
                markers[index].infowindow.open(map, markers[index]);
                map.setCenter(pos);
            };
        };
    });
    listItemEl.mouseleave(function() {
        const idListItem = this.id;
        const index = markers.findIndex( item => { return item.id === idListItem })
        if (markers[index] !== undefined && saveMarkers[index].isFav === false) {
            markers[index].setIcon(redGeo);
            markers[index].infowindow.close();
        } else if (markers[index] !== undefined) {
            markers[index].infowindow.close();
        };
    });
};

const editBtn = () => {
    markerList.addEventListener('click', e => {
        if ($(e.target).hasClass('btnEdit')) {
            const liEl = e.target.closest('.list_item');
            const liID = liEl.getAttribute('id');
            const index = markers.findIndex( item => { return item.id === liID });
            const current = saveMarkers.find( item => { return item.id === liID });
            $('.wrap').removeClass('hide');
            $('.input-edit').focus();
            const input = $('.input-edit');
            $('.wrap').on('click', function(e) {
                if ($(e.target).hasClass('okBtn') && input.val()) {
                    e.preventDefault();
                    const value = input.val();
                    const li = $('.list_item');
                    liEl.children[0].innerHTML = value;
                    current.title = value;
                    markers[index].title = value;
                    markers[index].infowindow.setContent(value);
                    markers[index].infowindow.close();
                    markers[index].infowindow.open(map, markers[index]);
                    $('.okBtn').addClass('active');
                    $('.wrap').addClass('hide');
                    saveMarker();
                    $('.wrap').off();
                } else if ($(e.target).hasClass('okBtn') && !input.val()) {
                    $('.input-edit').attr('required', true);
                }  else if ($(e.target).hasClass('noBtn') || $(e.target).hasClass('wrap') || $(e.target).hasClass('title-popup')) {
                    e.preventDefault();
                    $('.input-edit').removeAttr('required');
                    $('.noBtn').addClass('active');
                    $('.wrap').addClass('hide');
                    $('.wrap').off()
                };
                input.val('');
            });
            $('.wrap').keyup( e => {
                if (event.keyCode == 13 && input.val()) {
                    const value = input.val();
                    const li = $('.list_item')
                    liEl.children[0].innerHTML = value;
                    current.title = value;
                    markers[index].title = value;
                    markers[index].infowindow.setContent(value);
                    markers[index].infowindow.close();
                    markers[index].infowindow.open(map, markers[index]);
                    $('.okBtn').addClass('active')
                    $('.wrap').addClass('hide');
                    saveMarker();
                    $('.wrap').off()
                };
            });
            input.val('')
            $('.wrap').keyup( e => {
                if (event.keyCode == 27) {
                    $('.input-edit').removeAttr('required')
                    $('.noBtn').addClass('active')
                    $('.wrap').addClass('hide');
                    $('.wrap').off()
                };
            });
        };
    });
};

const favBtnAdd = () => {
    markerList.addEventListener('click', e => {
        if ($(e.target).hasClass('btnFav')) {
            const liEl = e.target.closest('.list_item');
            const liID = liEl.getAttribute('id');
            const index = markers.findIndex( item => { return item.id === liID });
            const current = saveMarkers.find( item => { return item.id === liID });
            current.isFav = !current.isFav;
            if (current.isFav === true) {
                $(e.target).text('💔')
                $(e.target).addClass('favourite');
                liEl.classList.add('list_item-favourite');
                markers[index].setIcon(goldGeo);
                current.icon = markers[index].icon;
            } else {
                $(e.target).text('❤️')
                $(e.target).removeClass('favourite');
                liEl.classList.remove('list_item-favourite');
                markers[index].setIcon(greenGeo);
                current.icon = markers[index].icon;
            };
            saveMarker();
        };
    });
};

const deleteBtn = () => {
    markerList.addEventListener('click', e => {
        if ($(e.target).hasClass('btnDel')) {
            const liEl = e.target.closest('.list_item');
            const liID = liEl.getAttribute('id');
            const index = markers.findIndex( item => { return item.id === liID });
            liEl.style.opacity = 0;
            markers[index].setMap(null);
            saveMarkers.splice(index, 1);
            markers.splice(index, 1);
            setTimeout( () => { liEl.remove() }, 300);
            saveMarker();
        };
    });
};