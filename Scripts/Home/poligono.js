if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.poligono = {
    mapa: null,
    location: null,
    shape: null,
    path: new google.maps.MVCArray,
    markers: [],
    poligono: null,
    alterado: false,

    inicializar: function () {
        gafisa.alphabook.home.poligono.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#marcarPoligono').live('click', gafisa.alphabook.home.poligono.aoAbrirMapaPoligono);
        $('#modalPoligono').on('shown', gafisa.alphabook.home.poligono.aposAbrirModalPoligono);
        $('#modalPoligono').on('hidden', gafisa.alphabook.home.poligono.aposFecharModalPoligono);

        $('#fecharModalPoligono').click(gafisa.alphabook.home.poligono.aoLimparMarcacaoPoligono);
        $('#cancelarPoligono').click(gafisa.alphabook.home.poligono.aoCancelarMarcacaoPoligono);
        $('#concluirModalPoligono').click(gafisa.alphabook.home.poligono.aoConcluirMarcacaoPoligono);
    },

    aoAbrirMapaPoligono: function () {
        if (!$('#Estado').val().length || !$('#Cidade').val().length) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.preencha.format('Cidade'));
        }
        else {
            $('#modalProjeto').modal('hide');
            $('#modalPoligono').modal('show');
        }
    },

    aposAbrirModalPoligono: function () {
        var cidade = $('#Cidade').find('option:selected').text();
        var localizacao = "{0}, {1} - {2}, {3} - {4}".format($('#endereco').val(), $('#numero').val(), $('#bairro').val(), cidade, $('#Estado').val());
        $.maps.getLocationFromAddress(localizacao, null, gafisa.alphabook.home.poligono.criarPontoInicial);
    },

    criarPontoInicial: function (location, success) {
        var bounds = $.maps.getBounds(location.lat(), location.lng());
        gafisa.alphabook.home.poligono.location = location;

        $('#mapaPoligono').height($('#modalPoligono').height() - $('#modalPoligono > .modal-footer').height() * 2);

        gafisa.alphabook.home.poligono.mapa = $.maps.createMap($('#mapaPoligono')[0], bounds, success ? 20 : 4);

        gafisa.alphabook.home.poligono.poligono = new google.maps.Polygon({
            strokeWeight: 3,
            fillColor: '#5555FF'
        });

        gafisa.alphabook.home.poligono.poligono.setMap(gafisa.alphabook.home.poligono.mapa);
        gafisa.alphabook.home.poligono.poligono.setPaths(new google.maps.MVCArray([gafisa.alphabook.home.poligono.path]));

        google.maps.event.addListener(gafisa.alphabook.home.poligono.mapa, 'click', function (e) {
            gafisa.alphabook.home.poligono.adicionarPonto(e.latLng);
        });

        if (!String.isNullOrWhiteSpace($('#marcarPoligono').data('latlng'))) {
            var coordenadasSalvas = $('#marcarPoligono').data('latlng').split(' ');

            for (var i = 0; i < coordenadasSalvas.length; i++) {
                var coordenada = coordenadasSalvas[i].split('|');
                var latLng = new google.maps.LatLng(parseFloat(coordenada[0].replace(',', '.')), parseFloat(coordenada[1].replace(',', '.')));
                gafisa.alphabook.home.poligono.adicionarPonto(latLng, coordenada[2]);
            }
        }

        for (var i = 0; i < gafisa.alphabook.home.poligono.markers.length; i++) {
            gafisa.alphabook.home.poligono.markers[i].setMap(gafisa.alphabook.home.poligono.mapa);
        }
    },

    adicionarPonto: function (position, length) {
        gafisa.alphabook.home.poligono.path.insertAt(length == null ? gafisa.alphabook.home.poligono.path.length : length, position);

        var marker = new google.maps.Marker({
            position: position,
            map: gafisa.alphabook.home.poligono.mapa,
            draggable: true,
            icon: $.maps.createIcon(0, 0)
        });

        gafisa.alphabook.home.poligono.markers.push(marker);
        marker.setTitle("#" + gafisa.alphabook.home.poligono.path.length);

        google.maps.event.addListener(marker, 'click', function () {
            marker.setMap(null);
            for (var i = 0, I = gafisa.alphabook.home.poligono.markers.length; i < I && gafisa.alphabook.home.poligono.markers[i] != marker; ++i);
            gafisa.alphabook.home.poligono.markers.splice(i, 1);
            gafisa.alphabook.home.poligono.path.removeAt(i);
        });

        google.maps.event.addListener(marker, 'dragend', function () {
            for (var i = 0, I = gafisa.alphabook.home.poligono.markers.length; i < I && gafisa.alphabook.home.poligono.markers[i] != marker; ++i);
            gafisa.alphabook.home.poligono.path.setAt(i, marker.getPosition());
        });
    },

    aposFecharModalPoligono: function () {
        if (gafisa.alphabook.home.poligono.poligono != null) {
            $('#areaPoligono').val(Math.round(google.maps.geometry.spherical.computeArea(gafisa.alphabook.home.poligono.poligono.getPath())));
        }
        $('#modalProjeto').modal('show');
        $('#modalPoligono').modal('hide');
    },

    aoLimparMarcacaoPoligono: function () {
        $('#marcarPoligono').data('latlng', '');
        gafisa.alphabook.home.poligono.aoEncerrarMarcacaoPoligono();
        gafisa.alphabook.home.poligono.alterado = true;
    },

    aoConcluirMarcacaoPoligono: function () {
        $('#marcarPoligono').data('latlng', '');
        gafisa.alphabook.home.poligono.alterado = true;
    },

    aoCancelarMarcacaoPoligono: function () {
        gafisa.alphabook.home.poligono.aoEncerrarMarcacaoPoligono();
    },

    aoEncerrarMarcacaoPoligono: function () {
        if (gafisa.alphabook.home.poligono != undefined) {
            for (var i = 0; i < gafisa.alphabook.home.poligono.markers.length; i++) {
                gafisa.alphabook.home.poligono.markers[i].setMap(null);
            }
            gafisa.alphabook.home.poligono.markers = [];
            if (gafisa.alphabook.home.poligono.poligono != null) {
                gafisa.alphabook.home.poligono.poligono.setMap(null);
                gafisa.alphabook.home.poligono.poligono = null;
            }
            gafisa.alphabook.home.poligono.path = new google.maps.MVCArray;
        }
    }
};

$(document).ready(gafisa.alphabook.home.poligono.inicializar);
