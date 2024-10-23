$.fn.maps = function (options) {
    var bounds = $.maps.getArrayBounds(options.points);
    var map = $.maps.createMap(this[0], bounds);
    var markers = new Array();


    for (var i = 0; i < options.points.length; i++) {
        var marker = $.maps.createMarker(map, options.points[i], options.viewDetailOnClick);

        markers.push(marker);
    }

    if (options.enableClustering === true) {
        new MarkerClusterer(map, markers, { maxZoom: 19 });
    }

    if (options.points.length == 1) {
        $.maps.setMaxZoom(map);
    }
    
    
    map.fitBounds(bounds);

    return map;
};

var infoWindow;

$.maps = {
    createMap: function (domElement, bounds, zoom) {
        var mapa = new google.maps.Map(domElement, {
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            center: bounds.getCenter(),
            zoom: zoom || 4
        });

        var mc = new MarkerClusterer(mapa, [], { maxZoom: 19 });

        return mapa;
    },

    onIdle: function (map) {
        google.maps.event.addListener(map, 'idle', function () {
            $('input:checkbox[name=estabelecimentos]:checked').each(function () {
                gafisa.alphabook.home.mapa.buscarPontosInteresse($(this).val());
            });
        });
    },

    getLocation: function (lat, lng) {
        return new google.maps.LatLng(lat, lng);
    },

    setLocation: function (map, lat, lng) {
        $.maps.setMaxZoom(map);

        var bounds = $.maps.getBounds(lat, lng);

        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
    },

    setMaxZoom: function (map) {
        google.maps.event.addListenerOnce(map, 'bounds_changed', function () {
            map.setZoom(16);
        });
    },

    mouseLocation: {},

    trackMouse: function (map) {
        google.maps.event.addListener(map, 'mousemove', function (event) {
            $.maps.mouseLocation = event.latLng;
        });
    },

    getBounds: function (lat, lng) {
        var bounds = new google.maps.LatLngBounds();

        bounds.extend($.maps.getLocation(lat, lng));

        return bounds;
    },

    getArrayBounds: function (array) {
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < array.length; i++) {
            bounds.extend(array[i].location);
        }

        return bounds;
    },

    createInfoWindow: function (location, content, map) {
        if (infoWindow != undefined)
            infoWindow.close();

        infoWindow = new google.maps.InfoWindow({ position: location, content: content, maxWidth: 300 });
        infoWindow.open(map);
    },

    createInfoWindowCallback: function (location, content, maxWidth) {
        if (infoWindow != undefined)
            infoWindow.close();

        if (maxWidth == undefined)
            maxWidth = 300;

        infoWindow = new google.maps.InfoWindow({ position: location, content: content, maxWidth: maxWidth });
        infoWindow.open(gafisa.alphabook.home.mapas.mapa);

        google.maps.event.addListener(infoWindow, 'domready', function () {
            gafisa.alphabook.home.mapas.aoAbrirInfoWindowProjeto();
        });

    },

    closeInfoWindow: function () {
        if (infoWindow != undefined)
            infoWindow.close();
    },

    createSearchMarker: function (map, location, contentSelector, callback) {
        var marker = new google.maps.Marker({
            map: map,
            position: location,
            animation: google.maps.Animation.DROP,
            icon: $.maps.createIcon(0, 0),
            title: 'Por onde você quer começar?',
            cursor: 'pointer'
        });


        $.maps.addIconListener(marker);

        var info;
        var windowContent = contentSelector[0];
        var input = contentSelector.find('input:text');

        $.maps.trackMouse(map);
        $.maps.onIdle(map);

        google.maps.event.addListener(marker, 'click', function () {
            if (info && !info.map) {
                info.open(map, this);
            }
        });

        google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
            $('#marcarPonto').draggable({
                stop: gafisa.alphabook.home.mapas.aoMarcarPonto,
                cursorAt: { top: 48, left: 9 }
            });

            info = new google.maps.InfoWindow({ position: location, content: windowContent });

            info.open(map, marker);

            contentSelector.show();

            google.maps.event.addListener(info, 'domready', function () {
                input.focus();
            });

            google.maps.event.addListenerOnce(info, 'domready', function () {
                var options = {
                    types: ['geocode'],
                    componentRestrictions: { country: 'br' }
                };

                new google.maps.places.Autocomplete(input[0], options);

                if (callback && typeof callback == 'function') {
                    callback();
                }
            });
        });

        return marker;
    },

    createPlaceMarker: function (map, place, type, iconUrl) {
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
            icon: new google.maps.MarkerImage(iconUrl),
            title: place.name,
            cursor: 'pointer'
        });

        if (infoWindow && infoWindow.map) {
            infoWindow.close();
        }

        infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
            var currentMarker = this;

            $.ajax({
                type: 'GET',
                dataType: 'html',
                url: gafisa.alphabook.rotas.localizacao.detalhePontoInteresse,
                data: { id: place.id },
                success: function (html) {
                    infoWindow.setContent(html);
                    infoWindow.open(map, currentMarker);
                    //infoWindow.id = id;
                    google.maps.event.addListener(infoWindow, 'domready', function () {
                        //gafisa.alphabook.home.mapa.aoAbrirInfoWindow();
                    });
                },
                cache: false
            });
        });

        return marker;
    },

    createPlaceMarkerContato: function (map, place, iconUrl, editar, idContato) {
        var marker = new google.maps.Marker({
            map: gafisa.alphabook.home.mapas.mapa,
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
            icon: new google.maps.MarkerImage(iconUrl),
            title: place.name,
            cursor: 'pointer',
            draggable: editar,
        });

        if (infoWindow && infoWindow.map) {
            infoWindow.close();
        }

        if (editar) {
            marker.latitudeOriginal = marker.position.lat();
            marker.longitudeOriginal = marker.position.lng();
            marker.idContato = idContato;
            google.maps.event.addListener(marker, 'dragend', function () {
                gafisa.alphabook.home.mapas.aoTerminarArrastarContato(marker);
            });
        }

        infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
            var currentMarker = this;

            var projetoId = null;

            if ($("#mapaProjeto #checkContatosProjeto").is(":checked"))
                projetoId = gafisa.alphabook.home.carrossel.obterIdProjeto();

            $.ajax({
                type: 'GET',
                dataType: 'html',
                url: gafisa.alphabook.rotas.localizacao.detalheContato,
                data: { id: place.id, idsTiposSelecionados: gafisa.alphabook.home.mapas.obterIdsSelecionados(), projetoId: projetoId },
                success: function (html) {
                    infoWindow.setContent(html);
                    infoWindow.open(gafisa.alphabook.home.mapas.mapa, currentMarker);
                    //infoWindow.id = id;
                    google.maps.event.addListener(infoWindow, 'domready', function () {
                        gafisa.alphabook.home.mapas.aoAbrirInfoWindowContato();
                    });
                },
                cache: false
            });
        });

        return marker;
    },

    createPlaceMarkerCidadeInteligenciaMercado: function (map, place, iconUrl) {
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
            icon: new google.maps.MarkerImage(iconUrl),
            title: place.name,
            cursor: 'pointer'
        });

        if (infoWindow && infoWindow.map) {
            infoWindow.close();
        }

        infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
            var currentMarker = this;
            $.ajax({
                type: 'GET',
                dataType: 'html',
                url: gafisa.alphabook.rotas.localizacao.detalheCidadeInteligenciaMercado,
                data: { id: place.id },
                success: function (html) {
                    infoWindow.setContent(html);
                    infoWindow.open(gafisa.alphabook.home.mapas.mapa, currentMarker);
                },
                cache: false
            });
        });

        return marker;
    },

    createPlaceMarkerPost: function (map, place, iconUrl, editar, idpostagem) {
        if (editar == undefined) editar = false;

        var marker = new google.maps.Marker({
            map: gafisa.alphabook.home.mapas.mapa,
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
            icon: new google.maps.MarkerImage(iconUrl),
            title: place.name,
            cursor: 'pointer',
            draggable: editar
        });

        if (editar) {
            marker.latitudeOriginal = marker.position.lat();
            marker.longitudeOriginal = marker.position.lng();
            marker.idPostagem = idpostagem;
            google.maps.event.addListener(marker, 'dragend', function () {
                gafisa.alphabook.home.mapas.aoTerminarArrastarPostagem(marker);
            });
        }

        if (infoWindow && infoWindow.map) {
            infoWindow.close();
        }

        infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
            var currentMarker = this;

            var inicio = $("#mapaProjeto #dataInicioFiltro").val();
            var fim = $("#mapaProjeto #dataFimFiltro").val();

            $.ajax({
                type: 'GET',
                dataType: 'html',
                url: gafisa.alphabook.rotas.localizacao.detalhePosts,
                data: {
                    id: place.id,
                    dataInicio: inicio,
                    dataFim: fim
                },
                success: function (html) {
                    infoWindow.setContent(html);
                    infoWindow.open(gafisa.alphabook.home.mapas.mapa, currentMarker);
                    //infoWindow.id = id;
                    google.maps.event.addListener(infoWindow, 'domready', function () {
                        gafisa.alphabook.home.mapas.aoAbrirInfoWindowPosts();
                    });
                },
                cache: false
            });
        });

        return marker;
    },

    getPlaceDetails: function (place, map, callback) {
        $('#mapa > div > div:last').remove();

        var options = { reference: place.reference };
        var placesService = new google.maps.places.PlacesService(map);

        placesService.getDetails(options, callback);
    },

    createIcon: function (type, count, selected) {
        var withCount = count > 1;
        var iconName, size, url;

        switch (type) {
            case 1:
                iconName = 'COMMERCIAL';
                break;
            case 2:
                iconName = 'HOUSE';
                break;
            case 3:
                iconName = 'BUILDING';
                break;
            default:
                iconName = 'OTHERS';
        }

        if (withCount) {
            iconName += '_COUNT';
        }

        if (selected === true) {
            iconName += '_HOVER';
        }

        if (withCount) {
            size = new google.maps.Size(68, 55);
            url = $.maps.icons[iconName].format(count);
        }
        else {
            size = new google.maps.Size(14, 14);
            url = $.maps.icons[iconName];
        }

        var originPoint = new google.maps.Point(0, 0);
        var offsetPoint = new google.maps.Point(7, 7);

        return new google.maps.MarkerImage(url, size, originPoint, offsetPoint);
    },

    addIconListener: function (marker, type, count) {
        type = type || 0;
        count = count || 0;

        google.maps.event.addDomListener(marker, 'mouseover', function () {
            this.setIcon($.maps.createIcon(type, count, true));
        });

        google.maps.event.addDomListener(marker, 'mouseout', function () {
            this.setIcon($.maps.createIcon(type, count));
        });
    },

    icons: {
        OTHERS: gafisa.alphabook.rotas.content + 'img/pin/pin-padrao.png',
        OTHERS_COUNT: gafisa.alphabook.rotas.content + 'img/pin/pin-padrao.png',
        OTHERS_HOVER: gafisa.alphabook.rotas.content + 'img/pin/pin-padrao.png',
        OTHERS_COUNT_HOVER: gafisa.alphabook.rotas.content + 'img/pin/{0}/pin-padrao.png'
    },

    getBrazilBounds: function () {
        var southwest = $.maps.getLocation(-33.75099130, -73.9828170);
        var northeast = $.maps.getLocation(5.2716020, -34.7929080);

        return new google.maps.LatLngBounds(southwest, northeast);
    },

    getBrazilLocation: function () {
        return $.maps.getLocation(-14.2350040, -51.925280);
    },

    getLocationFromAddress: function (address, nearBy, callback, parameters) {

        if (typeof google != 'undefined') {
            if (typeof google.maps != 'undefined') {
                var geocoder = new google.maps.Geocoder();
                var defaultLocation = $.maps.getBrazilLocation();
                var options = { address: address, region: 'br', bounds: $.maps.getBrazilBounds(), location: nearBy || defaultLocation };

                geocoder.geocode(options, function (results, status) {
                    var location;
                    var success = false;

                    if (status == google.maps.GeocoderStatus.OK) {
                        location = results[0].geometry.location;
                        success = true;
                    }
                    else {
                        location = defaultLocation;
                    }

                    if (callback && typeof callback == 'function') {
                        callback(location, success, parameters);
                    }
                });

                return location;
            }
        }

        if (callback)
            callback(null, false, parameters);
        return;

    },

    createDistanceWidget: function (options) {
        var icon = $.maps.createDistanceIcon(options.distance);
        var widget = new DistanceWidget({
            map: options.map,
            distance: options.distance,
            maxDistance: 5,
            marker: $.maps.createDraggableMarker(),
            color: '#c9292f',
            activeColor: '#c9292f',
            sizerIcon: icon,
            activeSizerIcon: icon,
            dragend: options.dragend
        });

        if (options.distanceChanged) {
            google.maps.event.addListener(widget, 'distance_changed', options.distanceChanged);
        }

        return widget;
    },

    addInfoWindowListener: function (eventName, listener) {
        google.maps.event.clearListeners(infoWindow, eventName);
        google.maps.event.addListener(infoWindow, eventName, listener);
    },

    locationIsWithinRadius: function (locationA, locationB, radius) {
        var d = $.maps.getDistanceBetween(locationA, locationB);

        return d < radius;
    },

    getDistanceBetween: function (locationA, locationB) {
        if (!locationA || !locationB) {
            return 0;
        }

        var R = 6371; // Radius of the Earth in km
        var lat = (locationB.lat() - locationA.lat()) * Math.PI / 180;
        var lng = (locationB.lng() - locationA.lng()) * Math.PI / 180;
        var a = Math.sin(lat / 2) * Math.sin(lat / 2) + Math.cos(locationA.lat() * Math.PI / 180) * Math.cos(locationB.lat() * Math.PI / 180) * Math.sin(lng / 2) * Math.sin(lng / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
};
