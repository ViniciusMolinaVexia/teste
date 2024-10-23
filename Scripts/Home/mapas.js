if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

var markerContatos = [];
var clusterers = [];

var markersInteligencia = null;
var markersPosts = null;

gafisa.alphabook.home.mapas = {
    mapa: null,
    location: null,
    inicializar: function () {
        gafisa.alphabook.home.mapas.registrarAcoes();
    },
    contatos: {},
    posts: {},
    cidadesInteligenciaMercado: {},
    projetos: {},
    markers: [],
    poligono: null,
    callbackPoligono: null,
    path: null,
    selecionandoPonto: false,
    coordenadasNovoPontoInteresse: null,
    uploader: null,
    filtrouPost: false,

    registrarAcoes: function () {
        $('#tileMapasHome').livequery('click', gafisa.alphabook.home.mapas.aoClicarTileHome);
        $('#tileMapas').livequery('click', gafisa.alphabook.home.mapas.aoClicarTile);
        $('#mapaProjeto #botaoFiltrosMapa').livequery('click', gafisa.alphabook.home.mapas.aoClicarFiltro);
        $('#mapaProjeto #tituloContatos').livequery('click', gafisa.alphabook.home.mapas.aoClicarFiltroContato);
        $('#mapaProjeto #tituloPosts').livequery('click', gafisa.alphabook.home.mapas.aoClicarFiltroPosts);
        $('#mapaProjeto #tituloProjetos').livequery('click', gafisa.alphabook.home.mapas.aoClicarFiltroProjetos);
        $('#mapaProjeto #tituloInteligenciaMercado').livequery('click', gafisa.alphabook.home.mapas.aoClicarFiltroInteligenciaMercado);
        $("#mapaProjeto #categoriasContatosMapa").livequery(gafisa.alphabook.home.mapas.configurarJstreeFiltro);
        $('#mapaProjeto #dataInicioFiltro, #mapaProjeto #dataFimFiltro').livequery(gafisa.alphabook.home.mapas.configurarDateTimePicker);
        $('#mapaProjeto #limparPostagens').livequery('click', gafisa.alphabook.home.mapas.aoClicarLimparPosts);
        $('#mapaProjeto #filtrarPostagens').livequery('click', gafisa.alphabook.home.mapas.aoClicarFiltrarPosts);
        $("#mapaProjeto #checkContatosProjeto").livequery('click', gafisa.alphabook.home.mapas.aoClicarContatosProjeto);
        $("#mapaProjeto #criarContato").livequery('click', gafisa.alphabook.home.contatos.aoClicarAdicionarContato);
        $('#mapaProjeto #checkDepartamentoProjetos').livequery('click', gafisa.alphabook.home.mapas.aoClicarDepartamentoProjetos);
        $('#mapaProjeto #filtroStatusProjeto').livequery('click', gafisa.alphabook.home.mapas.aoClicarFiltroStatusProjeto);
        $('#mapaProjeto #indicadoresInteligenciaMercado').livequery('click', gafisa.alphabook.home.mapas.aoClicarInteligenciaMercado);
        $('#mapaProjeto .status-tooltip').livequery(function () { $(this).tooltip(); });
        $('#mapaProjeto #campoBuscaMapa').livequery('keypress', gafisa.alphabook.home.mapas.aoDigitarEndereco);
        $('#mapaProjeto #botaoBuscaMapa').livequery('click', gafisa.alphabook.home.mapas.aoBuscarPorEndereco);
        $('#mapaProjeto #botaoExportarKml').livequery('click', gafisa.alphabook.home.mapas.aoExportarKml);
        $('#mapaProjeto #botaoLimparPoligono').livequery('click', gafisa.alphabook.home.mapas.limparPoligono);


    },

    aoExibirTela: function () {
        if ($('#botaoImportarKml').length > 0)
            gafisa.alphabook.home.mapas.configurarUploader();
    },

    aoExportarKml: function (e) {
        e.preventDefault();
        window.location.href = gafisa.alphabook.rotas.mapa.exportarKml.concatQueryString({ projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto() });
    },

    configurarUploader: function () {
        $.browser.chrome = $.browser.webkit && window.chrome;
        $.browser.safari = $.browser.webkit && !window.chrome;

        var runtimes = '';
        if (jQuery.browser.safari && !jQuery.browser.chrome) {
            runtimes = 'html4';
        } else {
            runtimes = 'flash,silverlight,html4';
        }

        gafisa.alphabook.home.mapas.uploader = new plupload.Uploader({
            runtimes: runtimes,
            browse_button: 'botaoImportarKml',
            container: 'container',
            max_file_size: '50mb',
            url: gafisa.alphabook.rotas.mapa.importarKml,
            flash_swf_url: gafisa.alphabook.rotas.uploadFlash,
            silverlight_xap_url: gafisa.alphabook.rotas.uploadSiverlight,
            filters: [{ title: 'Arquivos KML (.kml)', extensions: 'kml' }],
            urlstream_upload: true,
            multipart_params: { "projetoId": gafisa.alphabook.home.carrossel.obterIdProjeto() }
        });

        gafisa.alphabook.home.mapas.uploader.init();
        gafisa.alphabook.home.mapas.uploader.bind('FilesAdded', gafisa.alphabook.home.mapas.aposSelecionarArquivo);
        gafisa.alphabook.home.mapas.uploader.bind('FileUploaded', gafisa.alphabook.home.mapas.aposCompletarUpload);
        gafisa.alphabook.home.mapas.uploader.refresh();
    },

    aposSelecionarArquivo: function (up, files) {
        if ($('#mapaProjeto').data('possui-coordenadas')) {
            $.dialogo.confirmar(gafisa.mensagens.comum.desejaSobreescreverCoordenadas, gafisa.alphabook.home.mapas.enviarArquivo, gafisa.alphabook.home.mapas.limparArquivos);
        } else {
            gafisa.alphabook.home.mapas.enviarArquivo();
        }
    },

    limparArquivos: function () {
        gafisa.alphabook.home.mapas.uploader.splice();
    },

    enviarArquivo: function (up, files) {
        $.loading({ action: 'show' });
        gafisa.alphabook.home.mapas.uploader.start();
    },

    aposCompletarUpload: function (up, file, response) {
        $.loading({ action: 'hide' });

        var resposta = $.parseJSON(response.response);
        if (resposta.sucesso) {
            $.navegar.mapa(gafisa.alphabook.home.carrossel.obterIdProjeto(), "projeto", gafisa.alphabook.home.carrossel.obterIdProjeto(), gafisa.alphabook.home.mapas.aoExibirTela);
        } else {
            gafisa.alphabook.mensagens.exibirMensagemErro(resposta.erros);
        }
    },

    aoClicarFiltroStatusProjeto: function () {
        var idStatus = $(this).val();
        if ($(this).is(':checked')) {
            gafisa.alphabook.home.mapas.buscarPoligonos(idStatus);
        } else {

            for (var place in gafisa.alphabook.home.mapas.projetos[idStatus]) {
                gafisa.alphabook.home.mapas.projetos[idStatus][place].setMap(null);
            }
            gafisa.alphabook.home.mapas.projetos[idStatus] = null;
        }
    },

    aoClicarDepartamentoProjetos: function () {
        $('#filtroProjetos #filtroStatusProjeto').prop('checked', $(this).is(':checked'));
        $('#filtroProjetos .status-check').each(gafisa.alphabook.home.mapas.aoClicarFiltroStatusProjeto);
    },

    buscarPoligonos: function (status) {
        $.get(gafisa.alphabook.rotas.localizacao.obterProjetos, {
            status: status
        }, function (json) {
            gafisa.alphabook.home.mapas.aposBuscarProjetos(json);
        });

    },

    aposBuscarProjetos: function (json) {

        gafisa.alphabook.home.mapas.bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < json.length; i++) {
            var locations = [];
            var pontos = new google.maps.LatLngBounds();

            for (var j = 0; j < json[i].Coordenadas.length; j++) {
                locations.push(new google.maps.LatLng(json[i].Coordenadas[j].Latitude, json[i].Coordenadas[j].Longitude));
                pontos.extend(locations[j]);
            }

            if (!gafisa.alphabook.home.mapas.projetos[json[i].StatusId]) {
                gafisa.alphabook.home.mapas.projetos[json[i].StatusId] = {};
            }

            if (!gafisa.alphabook.home.mapas.projetos[json[i].StatusId][json[i].ProjetoId]) {

                var poligono = new google.maps.Polygon({
                    strokeWeight: 3,
                    fillColor: json[i].Cor,
                    paths: locations,
                    projetoId: json[i].ProjetoId
                });

                poligono.setMap(gafisa.alphabook.home.mapas.mapa);

                gafisa.alphabook.home.mapas.projetos[json[i].StatusId][json[i].ProjetoId] = poligono;
            }
            else {
                if (!gafisa.alphabook.home.mapas.projetos[json[i].StatusId][json[i].ProjetoId].getMap()) {
                    gafisa.alphabook.home.mapas.projetos[json[i].StatusId][json[i].ProjetoId].setMap(gafisa.alphabook.home.mapas.mapa);
                }
            }
            google.maps.event.addListener(gafisa.alphabook.home.mapas.projetos[json[i].StatusId][json[i].ProjetoId], 'click', gafisa.alphabook.home.mapas.aoClicarPoligono);
            gafisa.alphabook.home.mapas.bounds.extend(pontos.getCenter());

        }

    },

    aoClicarPoligono: function () {
        var poligono = this;
        $.ajax({
            type: 'GET',
            data: { projetoId: poligono.projetoId },
            dataType: 'html',
            url: gafisa.alphabook.rotas.localizacao.detalheProjeto,
            success: function (html) {
                var pontos = new google.maps.LatLngBounds();
                var coordenadasPoligono = poligono.getPath().getArray();

                for (i = 0; i < coordenadasPoligono.length; i++) {
                    pontos.extend(coordenadasPoligono[i]);
                }
                $.maps.createInfoWindowCallback(pontos.getCenter(), html, gafisa.alphabook.home.mapas.mapa, gafisa.alphabook.home.mapas.aoAbrirInfoWindowProjeto);
            }
        });

    },

    aoClicarProjeto: function () {
        var id = $(this).data('id');
        window.location.href = gafisa.alphabook.rotas.home.index + 'Home/Index/' + id;
    },

    aoAbrirInfoWindowProjeto: function () {
        $('.projeto-mapa .tile-topo').livequery('click', gafisa.alphabook.home.mapas.aoClicarProjeto);

        $('.mapa-geral #mapa .projeto-mapa').parent().parent().css("position", "absolute");
        $('.mapa-geral #mapa .projeto-mapa').parent().parent().parent().css("position", "");
    },

    aoClicarFiltrarPosts: function () {

        gafisa.alphabook.home.mapas.aoClicarLimparPosts();

        if ($("#mapaProjeto #dataInicioFiltro").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatoria.format('Data e hora inicial'));
            gafisa.alphabook.home.mapas.filtrouPost = false;
            return;
        }

        if ($("#mapaProjeto #dataFimFiltro").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatoria.format('Data e hora final'));
            gafisa.alphabook.home.mapas.filtrouPost = false;
            return;
        }

        var dataInicio = $("#mapaProjeto #dataInicioFiltro").val();
        var dataFim = $("#mapaProjeto #dataFimFiltro").val();

        var projetoId = null;
        if ($("#mapaProjeto #checkPostProjeto").is(":checked"))
            projetoId = gafisa.alphabook.home.carrossel.obterIdProjeto();

        gafisa.alphabook.home.mapas.filtrouPost = true;

        gafisa.alphabook.home.mapas.buscarPosts(dataInicio, dataFim, projetoId);

    },

    buscarPosts: function (inicio, fim, projetoId) {
        var bounds = gafisa.alphabook.home.mapas.mapa.getBounds();
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();

        $.get(gafisa.alphabook.rotas.localizacao.obterPostagens, {
            dataInicio: inicio,
            dataFim: fim,
            latNordeste: ne.lat(),
            latSudoeste: sw.lat(),
            lngNordeste: ne.lng(),
            lngSudoeste: sw.lng(),
            projetoId: projetoId
        }, function (json) {
            gafisa.alphabook.home.mapas.aposBuscarPosts(json.results);
        });
    },

    aposBuscarPosts: function (results) {
        var markers = [];

        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            var id = place.id;

            if (typeof place.geometry.location.lat == 'number') {
                place.geometry.location = $.maps.getLocation(place.geometry.location.lat, place.geometry.location.lng);
            }

            if (!gafisa.alphabook.home.mapas.posts) {
                gafisa.alphabook.home.mapas.posts = {};
            }

            if (!gafisa.alphabook.home.mapas.posts[id]) {
                var icon = gafisa.alphabook.rotas.content + 'img/pin/pin-post.png';
                var marker = $.maps.createPlaceMarkerPost(gafisa.alphabook.home.mapas.mapa, place, icon, place.editar);
                marker.idPostagem = place.PostagemId;
                gafisa.alphabook.home.mapas.posts[id] = marker;

                markers.push(marker);
            }
            else {
                if (!gafisa.alphabook.home.mapas.posts[id].getMap()) {
                    gafisa.alphabook.home.mapas.posts[id].setMap(gafisa.alphabook.home.mapas.mapa);
                }
            }
        }


        var clusterStyles = [{
            textSize: 17,
            textColor: 'black',
            url: gafisa.alphabook.rotas.content + 'img/pin/pin-post.png',
            height: 27,
            width: 43
        }];

        var mcOptions = {
            styles: clusterStyles,
            maxZoom: 19
        };

        markersPosts = new MarkerClusterer(gafisa.alphabook.home.mapas.mapa, markers, mcOptions);
    },

    aoClicarContato: function () {
        var idContato = $(this).attr('data-idContato');
        gafisa.alphabook.home.contatos.abrirContato(idContato);
    },

    aoAbrirInfoWindowContato: function () {
        $('.box-contato-mapa .linha-contatos').livequery('click', gafisa.alphabook.home.mapas.aoClicarContato);
        $('.box-contato-mapa .bt-criar-contato').livequery('click', gafisa.alphabook.home.contatos.aoClicarAdicionarContato);
    },

    aoAbrirInfoWindowPosts: function () {
        $('.div-post-mapa .leiaMais').livequery('click', gafisa.alphabook.home.mapas.aoClicarPostCompleto);
    },

    aoClicarPostCompleto: function () {
        var idPostagem = $(this).attr('data-postagemid');
        gafisa.alphabook.home.timeline.exibirPostCompleto(idPostagem);
    },

    obterIdsSelecionados: function () {

        var idsSelecionados = [];

        $("#mapaProjeto #categoriasContatosMapa").jstree("get_checked", null, true).each
            (function () {
                idsSelecionados.push(this.id);
            });

        return idsSelecionados;
    },

    aoClicarContatosProjeto: function () {

        markerContatos = [];

        for (var i = 0; i < clusterers.length; i++) {
            if (clusterers[i])
                clusterers[i].clearMarkers();
        }

        for (var contato in gafisa.alphabook.home.mapas.contatos) {
            for (var place in gafisa.alphabook.home.mapas.contatos[contato]) {
                gafisa.alphabook.home.mapas.contatos[contato][place].setMap(null);
            }
            gafisa.alphabook.home.mapas.contatos[contato] = null;
        }

        var idsSelecionados = [];
        $("#mapaProjeto #categoriasContatosMapa").jstree("get_checked", null, true).each(function () { gafisa.alphabook.home.mapas.buscarContatos(this.id); });
    },

    configurarDateTimePicker: function () {
        $(this).datetimepicker({ defaultDate: new Date() });
    },

    aoClicarLimparPosts: function () {

        for (var place in gafisa.alphabook.home.mapas.posts) {
            gafisa.alphabook.home.mapas.posts[place].setMap(null);
        }

        gafisa.alphabook.home.mapas.posts = null;

        if (markersPosts)
            markersPosts.clearMarkers();
    },

    aoClicarInteligenciaMercado: function () {
        if (!$('#indicadoresInteligenciaMercado').is(':checked')) {
            gafisa.alphabook.home.mapas.limparInteligenciaMercado();
        } else {
            gafisa.alphabook.home.mapas.buscarCidadesInteligenciaMercado();
        }
    },

    limparInteligenciaMercado: function () {
        for (var place in gafisa.alphabook.home.mapas.cidadesInteligenciaMercado) {
            gafisa.alphabook.home.mapas.cidadesInteligenciaMercado[place].setMap(null);
        }

        gafisa.alphabook.home.mapas.cidadesInteligenciaMercado = null;

        if (markersInteligencia)
            markersInteligencia.clearMarkers();
    },

    alternarExibcaoFiltro: function (obj) {
        if (obj.is(":visible")) {
            obj.hide('slow');
            return;
        }

        $('#mapaProjeto #filtrosContatos').hide('slow');
        $('#mapaProjeto #filtroPosts').hide('slow');
        $('#mapaProjeto #filtroProjetos').hide('slow');
        $('#mapaProjeto #filtroInteligenciaMercado').hide('slow');

        obj.show('slow');
    },

    aoClicarFiltro: function () {
        $('#mapaProjeto #filtrosMapa').slideToggle('slow');
        if ($('#mapaProjeto #botaoFiltrosMapa').hasClass('bt-adicionar')) {
            $('#mapaProjeto #botaoFiltrosMapa').removeClass('bt-adicionar').addClass('bt-remover');
        } else {
            $('#mapaProjeto #botaoFiltrosMapa').removeClass('bt-remover').addClass('bt-adicionar');
        }
    },

    aoClicarFiltroContato: function () {
        gafisa.alphabook.home.mapas.alternarExibcaoFiltro($('#mapaProjeto #filtrosContatos'));
    },

    aoClicarFiltroPosts: function () {
        gafisa.alphabook.home.mapas.alternarExibcaoFiltro($('#mapaProjeto #filtroPosts'));
    },

    aoClicarFiltroProjetos: function () {
        gafisa.alphabook.home.mapas.alternarExibcaoFiltro($('#mapaProjeto #filtroProjetos'));
    },

    aoClicarFiltroInteligenciaMercado: function () {
        gafisa.alphabook.home.mapas.alternarExibcaoFiltro($('#mapaProjeto #filtroInteligenciaMercado'));
    },

    aoAbrirMapa: function () {
        $.maps.getLocationFromAddress("Brasil", null, gafisa.alphabook.home.mapas.criarPontoInicialMarcacao);
    },

    aoClicarTile: function () {
        if (!$(this).hasClass('inativo'))
            $.navegar.mapa(gafisa.alphabook.home.carrossel.obterIdProjeto(), "projeto", gafisa.alphabook.home.carrossel.obterIdProjeto(), gafisa.alphabook.home.mapas.aoExibirTela);

    },

    aoClicarTileHome: function () {
        if (!$(this).hasClass('inativo'))
            $.navegar.mapa(null, "home", null, gafisa.alphabook.home.mapas.aoExibirTela);
    },

    posicionarMapa: function (id, tipo) {

        if (tipo == "contato") {
            gafisa.alphabook.home.mapas.buscarContato(id);
        }

        if (tipo == "postagem") {
            gafisa.alphabook.home.mapas.buscarPostagem(id);
        }

        if (tipo == "projeto") {
            gafisa.alphabook.home.mapas.buscarProjeto(id);
        }

        if (tipo == "cidade") {
            gafisa.alphabook.home.mapas.buscarCidade(id);
        }

        if (tipo == "home") {
            gafisa.alphabook.home.mapas.buscarPais();
        }

        if (tipo == "endereco") {
            gafisa.alphabook.home.mapas.buscarEndereco(id);
        }
    },

    configurarIconeNovoPost: function () {

        if (!gafisa.alphabook.home.carrossel.estaNoProjeto()) return;
        if (!gafisa.alphabook.autorizacao.usuarioPossuiPermissao(gafisa.alphabook.autorizacao.secao.homeProjeto, gafisa.alphabook.autorizacao.funcionalidade.mapasPosts, gafisa.alphabook.autorizacao.acao.adicionar)) return;

        var controle = document.createElement('div');
        new gafisa.alphabook.home.mapas.controleMarcacaoPonto(controle, gafisa.alphabook.home.mapas.mapa);

        controle.index = 1;
        gafisa.alphabook.home.mapas.mapa.controls[google.maps.ControlPosition.TOP_LEFT].push(controle);

        google.maps.event.addListenerOnce(gafisa.alphabook.home.mapas.mapa, 'tilesloaded', function () {
            $('#marcarPonto').draggable({
                stop: gafisa.alphabook.home.mapas.aoMarcarPonto,
                cursorAt: { top: 48, left: 9 }
            });
        });

        $.maps.trackMouse(gafisa.alphabook.home.mapas.mapa);
        $.maps.onIdle(gafisa.alphabook.home.mapas.mapa);

    },

    configurarIconeNovoContato: function () {
        if (!gafisa.alphabook.home.carrossel.estaNoProjeto()) return;
        if (!gafisa.alphabook.autorizacao.usuarioPossuiPermissao(gafisa.alphabook.autorizacao.secao.homeProjeto, gafisa.alphabook.autorizacao.funcionalidade.mapasContato, gafisa.alphabook.autorizacao.acao.adicionar)) return;

        var controle = document.createElement('div');
        new gafisa.alphabook.home.mapas.controleMarcacaoPontoContato(controle, gafisa.alphabook.home.mapas.mapa);

        controle.index = 1;
        gafisa.alphabook.home.mapas.mapa.controls[google.maps.ControlPosition.TOP_LEFT].push(controle);

        google.maps.event.addListenerOnce(gafisa.alphabook.home.mapas.mapa, 'tilesloaded', function () {
            $('#marcarPontoContato').draggable({
                stop: gafisa.alphabook.home.mapas.aoMarcarPontoContato,
                cursorAt: { top: 48, left: 9 }
            });
        });

        $.maps.trackMouse(gafisa.alphabook.home.mapas.mapa);
        $.maps.onIdle(gafisa.alphabook.home.mapas.mapa);

    },

    configurarJstreeFiltro: function () {
        $("#mapaProjeto #categoriasContatosMapa").jstree({
            "themes": {
                "theme": "default",
                "dots": true,
                "icons": false
            },
            "plugins": ["themes", "checkbox", "html_data", "ui"]
        }).bind("check_node.jstree uncheck_node.jstree", gafisa.alphabook.home.mapas.aoClicarContatosProjeto);
    },

    aoClicarTipoContato: function (event, data) {
        var idTipoContato = data.rslt.obj.attr('data-categoriaId');

        if (event.type == 'check_node') {
            gafisa.alphabook.home.mapas.buscarContatos(idTipoContato);
        }
        else {
            for (var place in gafisa.alphabook.home.mapas.contatos[idTipoContato]) {
                gafisa.alphabook.home.mapas.contatos[idTipoContato][place].setMap(null);
            }
            gafisa.alphabook.home.mapas.contatos[idTipoContato] = null;
        }
    },

    buscarPostagem: function (idPostagem) {
        $.get(gafisa.alphabook.rotas.localizacao.obterPostagem,
            { idPostagem: idPostagem },
            function (json) {
                gafisa.alphabook.home.mapas.aposBuscarPostagem(json.results, idPostagem);
            });
    },

    aposBuscarPostagem: function (results, idPostagem) {
        var place = results;

        if (typeof place.geometry.location.lat == 'number') {
            place.geometry.location = $.maps.getLocation(place.geometry.location.lat, place.geometry.location.lng);
        }

        var icon = gafisa.alphabook.rotas.content + 'img/pin/pin-post.png';
        var marker = $.maps.createPlaceMarkerPost(gafisa.alphabook.home.mapas.mapa, place, icon, results.editar, idPostagem);
        gafisa.alphabook.home.mapas.criarPontoInicialDestaque(marker);

    },

    buscarContato: function (idContato) {

        $.get(gafisa.alphabook.rotas.localizacao.obterContato, { contatoId: idContato },
            function (json) {
                gafisa.alphabook.home.mapas.aposBuscarContato(json.results);
            });
    },

    buscarProjeto: function (idProjeto) {

        gafisa.alphabook.home.mapas.path = new google.maps.MVCArray;

        $.get(gafisa.alphabook.rotas.localizacao.obterDadosProjeto, {
            idProjeto: idProjeto
        }, function (json) { gafisa.alphabook.home.mapas.aposObterCoordenadasSalvas(json, false); });

    },

    buscarEndereco: function (endereco) {
        if (String.isNullOrWhiteSpace(endereco))
            return false;

        $.maps.getLocationFromAddress(endereco, null, gafisa.alphabook.home.mapas.aposObterEndereco);
    },

    aposObterEndereco: function (location) {
        var place = { id: 0, address: '', cidadeAlvo: '', geometry: {} };
        place.geometry.location = $.maps.getLocation(location.lat(), location.lng());
        var marker = $.maps.createPlaceMarkerCidadeInteligenciaMercado(gafisa.alphabook.home.mapas.mapa, place, '');
        gafisa.alphabook.home.mapas.mapa.panTo(marker.getPosition());
        gafisa.alphabook.home.mapas.mapa.setZoom(12);

        gafisa.alphabook.home.mapas.mapa.setMapTypeId(google.maps.MapTypeId.HYBRID);
    },

    buscarCidade: function (idCidade) {

        $.get(gafisa.alphabook.rotas.localizacao.obterCidade,
            { cidadeId: idCidade },
            function (json) {
                gafisa.alphabook.home.mapas.aposBuscarCidade(json.results);
            });
    },

    buscarPais: function () {

        $.get(gafisa.alphabook.rotas.localizacao.obterPais,
            null,
            function (json) {
                gafisa.alphabook.home.mapas.aposBuscarPais(json.results);
            });
    },

    buscarCidadesInteligenciaMercado: function () {

        var bounds = gafisa.alphabook.home.mapas.mapa.getBounds();
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        var projetoId = null;

        $.get(gafisa.alphabook.rotas.localizacao.obterCidadesInteligenciaMercado, {

            latNordeste: ne.lat(),
            latSudoeste: sw.lat(),
            lngNordeste: ne.lng(),
            lngSudoeste: sw.lng()

        }, function (json) {
            gafisa.alphabook.home.mapas.aposBuscarCidadesInteligenciaMercado(json.results);
        });
    },

    buscarContatos: function (idTipoContato) {
        var bounds = gafisa.alphabook.home.mapas.mapa.getBounds();
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        var projetoId = null;

        if ($("#mapaProjeto #checkContatosProjeto").is(":checked"))
            projetoId = gafisa.alphabook.home.carrossel.obterIdProjeto();

        $.get(gafisa.alphabook.rotas.localizacao.obterContatos, {
            categoriaContatoId: idTipoContato,
            projetoId: projetoId,
            latNordeste: ne.lat(),
            latSudoeste: sw.lat(),
            lngNordeste: ne.lng(),
            lngSudoeste: sw.lng()

        }, function (json) {
            gafisa.alphabook.home.mapas.aposBuscarContatos(json.results, idTipoContato);
        });
    },

    aposBuscarCidadesInteligenciaMercado: function (results) {
        var markers = [];

        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            var id = place.id;

            if (typeof place.geometry.location.lat == 'number') {
                place.geometry.location = $.maps.getLocation(place.geometry.location.lat, place.geometry.location.lng);
            }

            if (!gafisa.alphabook.home.mapas.cidadesInteligenciaMercado) {
                gafisa.alphabook.home.mapas.cidadesInteligenciaMercado = {};
            }

            if (!gafisa.alphabook.home.mapas.cidadesInteligenciaMercado[id]) {
                var icon = gafisa.alphabook.rotas.content + (place.cidadeAlvo ? 'img/pin/pin-int-mercado-cid-alvo-sim.png' : 'img/pin/pin-int-mercado-cid-alvo-nao.png');
                var marker = $.maps.createPlaceMarkerCidadeInteligenciaMercado(gafisa.alphabook.home.mapas.mapa, place, icon);

                gafisa.alphabook.home.mapas.cidadesInteligenciaMercado[id] = marker;

                markers.push(marker);
            }
            else {
                if (!gafisa.alphabook.home.mapas.cidadesInteligenciaMercado[id].getMap()) {
                    gafisa.alphabook.home.mapas.cidadesInteligenciaMercado[id].setMap(gafisa.alphabook.home.mapas.mapa);
                }
            }
        }

        var clusterStyles = [{
            textSize: 17,
            textColor: 'black',
            url: gafisa.alphabook.rotas.content + 'img/pin/pin-int-mercado-cid-alvo-nao.png',
            height: 42,
            width: 32
        }];

        var mcOptions = {
            styles: clusterStyles,
            maxZoom: 19
        };

        markersInteligencia = new MarkerClusterer(gafisa.alphabook.home.mapas.mapa, markers, mcOptions);
    },

    aposBuscarContatos: function (results, idTipoContato) {

        markerContatos = [];

        if (clusterers[idTipoContato])
            clusterers[idTipoContato].clearMarkers();

        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            var id = place.id;

            if (typeof place.geometry.location.lat == 'number') {
                place.geometry.location = $.maps.getLocation(place.geometry.location.lat, place.geometry.location.lng);
            }

            if (!gafisa.alphabook.home.mapas.contatos[idTipoContato]) {
                gafisa.alphabook.home.mapas.contatos[idTipoContato] = {};
            }

            if (!gafisa.alphabook.home.mapas.contatos[idTipoContato][id]) {
                var icon = gafisa.alphabook.rotas.content + 'img/pin/pin-contato.png';
                var marker = $.maps.createPlaceMarkerContato(gafisa.alphabook.home.mapas.mapa, place, icon);

                gafisa.alphabook.home.mapas.contatos[idTipoContato][id] = marker;
                markerContatos.push(marker);
            }
            else {
                if (!gafisa.alphabook.home.mapas.contatos[idTipoContato][id].getMap()) {
                    gafisa.alphabook.home.mapas.contatos[idTipoContato][id].setMap(gafisa.alphabook.home.mapas.mapa);
                }
            }
        }

        var mcOptions = {
            styles: [{
                textSize: 17,
                textColor: 'black',
                url: gafisa.alphabook.rotas.content + 'img/pin/pin-contato.png',
                height: 42,
                width: 32
            }],
            maxZoom: 19
        };

        var categoriaContato = new MarkerClusterer(gafisa.alphabook.home.mapas.mapa, markerContatos, mcOptions);
        clusterers[idTipoContato] = categoriaContato;
    },

    aposBuscarContato: function (results) {
        var place = results;

        if (typeof place.geometry.location.lat == 'number') {
            place.geometry.location = $.maps.getLocation(place.geometry.location.lat, place.geometry.location.lng);
        }

        var icon = gafisa.alphabook.rotas.content + 'img/pin/pin-contato.png';
        var marker = $.maps.createPlaceMarkerContato(gafisa.alphabook.home.mapas.mapa, place, icon, true, place.idContato);

        gafisa.alphabook.home.mapas.criarPontoInicialDestaque(marker);

    },

    aposBuscarCidade: function (results) {
        var place = results;

        if (typeof place.geometry.location.lat == 'number') {
            place.geometry.location = $.maps.getLocation(place.geometry.location.lat, place.geometry.location.lng);
        }

        var icon = gafisa.alphabook.rotas.content + (place.cidadeAlvo ? 'img/pin/pin-int-mercado-cid-alvo-sim.png' : 'img/pin/pin-int-mercado-cid-alvo-nao.png');
        var marker = $.maps.createPlaceMarkerCidadeInteligenciaMercado(gafisa.alphabook.home.mapas.mapa, place, icon);

        gafisa.alphabook.home.mapas.criarPontoInicialDestaque(marker);

    },

    aposBuscarPais: function (results) {

        var place = results;

        if (typeof place.geometry.location.lat == 'number') {
            place.geometry.location = $.maps.getLocation(place.geometry.location.lat, place.geometry.location.lng);
        }

        var marker = $.maps.createPlaceMarkerCidadeInteligenciaMercado(gafisa.alphabook.home.mapas.mapa, place, '');
        gafisa.alphabook.home.mapas.criarPontoInicialDestaque(marker, true);

        gafisa.alphabook.home.mapas.mapa.setMapTypeId(google.maps.MapTypeId.HYBRID);

        google.maps.event.addListener(gafisa.alphabook.home.mapas.mapa, 'zoom_changed', function () {
            gafisa.alphabook.home.mapas.aposAlterarZoom();
        });

    },

    criarPontoInicialDestaque: function (marker, home) {
        var bounds = $.maps.getBounds(marker.position.lat(), marker.position.lng());

        gafisa.alphabook.home.mapas.mapa = $.maps.createMap($('#mapa')[0], bounds, home ? 4 : 11);
        gafisa.alphabook.home.mapas.location = location;
        marker.setMap(gafisa.alphabook.home.mapas.mapa);

        if (!home) {
            gafisa.alphabook.home.mapas.configurarIconeNovoPost();
            gafisa.alphabook.home.mapas.configurarIconeNovoContato();
        }
    },

    controleMarcacaoPonto: function (controlDiv, map) {

        controlDiv.style.padding = '5px';

        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = 'white';
        controlUI.style.borderStyle = 'solid';
        controlUI.style.borderWidth = '2px';
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Arraste para selecionar a posição da postagem.';
        controlDiv.appendChild(controlUI);

        var controlText = document.createElement('div');
        controlText.style.fontFamily = 'Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.paddingLeft = '4px';
        controlText.style.paddingRight = '4px';
        controlText.innerHTML = '<img src="' + gafisa.alphabook.rotas.content + 'img/pin/pin-post-superior.png" alt="Marcar ponto" id="marcarPonto" />';
        controlUI.appendChild(controlText);
    },

    controleMarcacaoPontoContato: function (controlDiv, map) {

        controlDiv.style.padding = '5px';

        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = 'white';
        controlUI.style.borderStyle = 'solid';
        controlUI.style.borderWidth = '2px';
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Arraste para definir a posição do novo post.';
        controlDiv.appendChild(controlUI);

        var controlText = document.createElement('div');
        controlText.style.fontFamily = 'Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.paddingLeft = '4px';
        controlText.style.paddingRight = '4px';
        controlText.innerHTML = '<img src="' + gafisa.alphabook.rotas.content + 'img/pin/pin-contato.png" alt="Marcar ponto contato" id="marcarPontoContato" />';
        controlText.title = 'Arraste para definir a posição do novo contato.';
        controlUI.appendChild(controlText);
    },

    configurarMarcacaoPonto: function (callback, idProjeto) {
        gafisa.alphabook.home.mapas.selecionandoPonto = true;
        gafisa.alphabook.home.mapas.buscarProjeto(idProjeto);
        $("#mapaProjeto #confirmarMarcacaoPonto, #mapaProjeto #cancelarMarcacaoPonto").show();
        $("#mapaProjeto #confirmarMarcacaoPonto").off().on('click', function () { gafisa.alphabook.home.mapas.aoConfirmarMarcacao(callback); });
        $("#mapaProjeto #cancelarMarcacaoPonto").off().on('click', gafisa.alphabook.home.mapas.aoCancelarMarcacao);
    },

    aoConfirmarMarcacao: function (callback) {
        if (gafisa.alphabook.home.mapas.coordenadasNovoPontoInteresse != null) {
            $.navegar.anterior(function () { callback(gafisa.alphabook.home.mapas.coordenadasNovoPontoInteresse.lat(), gafisa.alphabook.home.mapas.coordenadasNovoPontoInteresse.lng()); });
        }
        else {
            gafisa.alphabook.home.mapas.aoCancelarMarcacao();
        }
    },

    aoCancelarMarcacao: function () {
        $.navegar.anterior();
    },

    aoMarcarPonto: function (e) {
        gafisa.alphabook.home.mapas.coordenadasNovoPontoInteresse = $.maps.mouseLocation;
        if (!gafisa.alphabook.home.mapas.selecionandoPonto) {
            gafisa.alphabook.home.postagem.aoConfirmarNavegacaoCompleto(gafisa.alphabook.home.mapas.coordenadasNovoPontoInteresse.lat(), gafisa.alphabook.home.mapas.coordenadasNovoPontoInteresse.lng());
        }
    },

    aoMarcarPontoContato: function (e) {
        gafisa.alphabook.home.mapas.coordenadasNovoPontoInteresse = $.maps.mouseLocation;
        //if (!gafisa.alphabook.home.mapas.selecionandoPonto) {}
        var latLng = new google.maps.LatLng(gafisa.alphabook.home.mapas.coordenadasNovoPontoInteresse.lat(), gafisa.alphabook.home.mapas.coordenadasNovoPontoInteresse.lng());
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ latLng: latLng }, function (responses) {
            if (responses && responses.length > 0) {

                var data = {};
                data.latitude = gafisa.alphabook.home.mapas.coordenadasNovoPontoInteresse.lat();
                data.longitude = gafisa.alphabook.home.mapas.coordenadasNovoPontoInteresse.lng();

                data.endereco = {};
                data.endereco.numero = responses[0].address_components[0].long_name;
                data.endereco.cep = responses[0].address_components[7].long_name;

                gafisa.alphabook.home.contatos.aoClicarAdicionarContato(data);
            }
        });
    },

    editarPoligono: function (idProjeto, callback, coordenadas) {
        gafisa.alphabook.home.mapas.path = new google.maps.MVCArray;

        $.get(gafisa.alphabook.rotas.localizacao.obterDadosProjeto, {
            idProjeto: idProjeto
        }, function (json) { gafisa.alphabook.home.mapas.aposObterCoordenadasSalvas(json, true, coordenadas); });

        $("#mapaProjeto #confirmarMarcacaoPonto, #mapaProjeto #cancelarMarcacaoPonto").show();
        $("#mapaProjeto #confirmarMarcacaoPonto").off().on('click', function () { gafisa.alphabook.home.mapas.aoConfirmarMarcacaoPoligono(callback); });
        $("#mapaProjeto #cancelarMarcacaoPonto").off().on('click', gafisa.alphabook.home.mapas.aoCancelarMarcacao);
        gafisa.alphabook.home.mapas.aoExibirTela();
    },

    aoConfirmarMarcacaoPoligono: function (callback) {
        if (gafisa.alphabook.home.mapas.markers.length > 0) {

            if (gafisa.alphabook.home.mapas.markers.length < 3) {
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.quantidadePontosObrigatorios);
                return;
            }
            var pontos = [];
            for (var i = 0; i < gafisa.alphabook.home.mapas.markers.length; i++) {
                var ponto = {};
                ponto.Latitude = gafisa.alphabook.home.mapas.markers[i].position.lat();
                ponto.Longitude = gafisa.alphabook.home.mapas.markers[i].position.lng();
                ponto.Ordem = i;

                pontos.push(ponto);
            }
            var area = Math.round(google.maps.geometry.spherical.computeArea(gafisa.alphabook.home.mapas.poligono.getPath()));
            $.navegar.anterior(function () { callback(pontos, area); });
        }
        else {
            gafisa.alphabook.home.mapas.aoCancelarMarcacao();
        }

        gafisa.alphabook.home.mapas.aoEncerrarMarcacaoPoligono();
    },

    aposObterCoordenadasSalvas: function (json, editar, coordenadas) {
        if (json.Sucesso) {
            gafisa.alphabook.home.mapas.configurarMapaPoligono(json, editar, coordenadas);
        }
    },

    configurarMapaPoligono: function (json, editar, coordenadas) {
        $.maps.getLocationFromAddress(json.Endereco, null, function (location, success) { gafisa.alphabook.home.mapas.criarPontoInicialPoligono(location, success, json, editar, coordenadas); });
    },

    criarPontoInicialPoligono: function (location, success, json, editar, coordenadas) {
        var bounds = $.maps.getBounds(location.lat(), location.lng());
        gafisa.alphabook.home.mapas.location = location;
        gafisa.alphabook.home.mapas.mapa = $.maps.createMap($('#mapa')[0], bounds, 13);

        if (coordenadas != undefined) {
            json.Poligono = [];
            var pontos = coordenadas.split(' ');
            for (var i = 0; i < pontos.length; i++) {
                var coord = pontos[i].split('|');
                if (coord.length == 3) {
                    var latLong = {};
                    latLong.Latitude = coord[0];
                    latLong.Longitude = coord[1];
                    latLong.Ordem = coord[2];

                    json.Poligono.push(latLong);
                }
            }
        }

        gafisa.alphabook.home.mapas.poligono = new google.maps.Polygon({
            strokeWeight: 3,
            fillColor: json.Cor,
            projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto(),
            strokeColor: (editar ? '#FF0000' : '#000000')
        });

        gafisa.alphabook.home.mapas.poligono.setMap(gafisa.alphabook.home.mapas.mapa);
        gafisa.alphabook.home.mapas.poligono.setPaths(new google.maps.MVCArray([gafisa.alphabook.home.mapas.path]));

        if (editar) {
            google.maps.event.addListener(gafisa.alphabook.home.mapas.mapa, 'click', function (e) {
                gafisa.alphabook.home.mapas.adicionarPonto(e.latLng, null, editar);
            });
        }

        if (json.Poligono.length > 0) {
            bounds = new google.maps.LatLngBounds();


            for (var i = 0; i < json.Poligono.length; i++) {
                var latLng = new google.maps.LatLng(json.Poligono[i].Latitude, json.Poligono[i].Longitude);
                bounds.extend(latLng);
                gafisa.alphabook.home.mapas.adicionarPonto(latLng, json.Poligono[i].Ordem, editar);
            }

            if (!editar) {
                google.maps.event.addListener(gafisa.alphabook.home.mapas.poligono, 'click', gafisa.alphabook.home.mapas.aoClicarPoligono);
            }
            for (var i = 0; i < gafisa.alphabook.home.mapas.markers.length; i++) {
                gafisa.alphabook.home.mapas.markers[i].setMap(gafisa.alphabook.home.mapas.mapa);
            }

            gafisa.alphabook.home.mapas.mapa.fitBounds(bounds);

            gafisa.alphabook.home.mapas.location = gafisa.alphabook.home.mapas.poligono.location;
        }

        gafisa.alphabook.home.mapas.configurarIconeNovoPost();
        gafisa.alphabook.home.mapas.configurarIconeNovoContato();

    },

    adicionarPonto: function (position, length, editar) {
        gafisa.alphabook.home.mapas.path.insertAt(length == null ? gafisa.alphabook.home.mapas.path.length : length, position);

        if (editar) {
            var marker = new google.maps.Marker({
                position: position,
                map: gafisa.alphabook.home.mapas.mapa,
                draggable: true,
                icon: $.maps.createIcon(0, 0)
            });

            gafisa.alphabook.home.mapas.markers.push(marker);
            marker.setTitle("#" + gafisa.alphabook.home.mapas.path.length);

            google.maps.event.addListener(marker, 'click', function () {
                marker.setMap(null);
                for (var i = 0, I = gafisa.alphabook.home.mapas.markers.length; i < I && gafisa.alphabook.home.mapas.markers[i] != marker; ++i);
                gafisa.alphabook.home.mapas.markers.splice(i, 1);
                gafisa.alphabook.home.mapas.path.removeAt(i);
            });

            google.maps.event.addListener(marker, 'dragend', function () {
                for (var i = 0, I = gafisa.alphabook.home.mapas.markers.length; i < I && gafisa.alphabook.home.mapas.markers[i] != marker; ++i);
                gafisa.alphabook.home.mapas.path.setAt(i, marker.getPosition());
            });

        }
    },

    aoEncerrarMarcacaoPoligono: function () {
        if (gafisa.alphabook.home.mapas != undefined) {
            for (var i = 0; i < gafisa.alphabook.home.mapas.markers.length; i++) {
                gafisa.alphabook.home.mapas.markers[i].setMap(null);
            }
            gafisa.alphabook.home.mapas.markers = [];
            if (gafisa.alphabook.home.mapas.poligono != null) {
                gafisa.alphabook.home.mapas.poligono.setMap(null);
                gafisa.alphabook.home.mapas.poligono = null;
            }
            gafisa.alphabook.home.mapas.path = new google.maps.MVCArray;
        }
    },

    aoTerminarArrastarPostagem: function (marker) {
        $.dialogo.confirmar(gafisa.mensagens.comum.alterarPosicaoPostagem, function () { gafisa.alphabook.home.mapas.aoConfirmarPosicionamentoPostagem(marker); }, function () { gafisa.alphabook.home.mapas.aoCancelarPosicionamentoPostagem(marker); });
    },

    aoConfirmarPosicionamentoPostagem: function (marker) {
        marker.latitudeOriginal = marker.position.lat();
        marker.longitudeOriginal = marker.position.lng();

        gafisa.alphabook.home.postagem.atualizarPosicaoPostagem(marker.position.lat(), marker.position.lng(), marker.idPostagem);

    },

    aoCancelarPosicionamentoPostagem: function (marker) {
        marker.setPosition(new google.maps.LatLng(marker.latitudeOriginal, marker.longitudeOriginal));
        gafisa.alphabook.home.mapas.mapa.panTo(new google.maps.LatLng(marker.latitudeOriginal, marker.longitudeOriginal));
    },

    aoTerminarArrastarContato: function (marker) {
        $.dialogo.confirmar(gafisa.mensagens.comum.alterarPosicaoContato, function () { gafisa.alphabook.home.mapas.aoConfirmarPosicionamentoContato(marker); }, function () { gafisa.alphabook.home.mapas.aoCancelarPosicionamentoPostagem(marker); });
    },


    aoConfirmarPosicionamentoContato: function (marker) {
        marker.latitudeOriginal = marker.position.lat();
        marker.longitudeOriginal = marker.position.lng();

        var latLng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ latLng: latLng }, function (responses) {
            if (responses && responses.length > 0) {

                var data = {};
                data.latitude = marker.position.lat();
                data.longitude = marker.position.lng();

                data.endereco = {};
                data.endereco.numero = responses[0].address_components[0].long_name;
                data.endereco.cep = responses[0].address_components[7].long_name;

                gafisa.alphabook.home.contatos.aoEditarContato(null, marker.idContato, data);
            }
        });
    },

    aoBuscarPorEndereco: function () {
        var endereco = $('#mapaProjeto #campoBuscaMapa').val();
        gafisa.alphabook.home.mapas.posicionarMapa(endereco, 'endereco');
    },

    aoDigitarEndereco: function (e) {
        if (e.keyCode == 13)
            gafisa.alphabook.home.mapas.aoBuscarPorEndereco();
    },

    limparPoligono: function () {
        for (var j = gafisa.alphabook.home.mapas.markers.length - 1; j >= 0; j--) {
            var marker = gafisa.alphabook.home.mapas.markers[j];
            google.maps.event.trigger(marker, 'click');
        }
    },

    aposAlterarZoom: function () {

        gafisa.alphabook.home.mapas.limparInteligenciaMercado();
        gafisa.alphabook.home.mapas.aoClicarInteligenciaMercado();

        if (gafisa.alphabook.home.mapas.filtrouPost && $('#dataInicioFiltro').val() && $('#dataFimFiltro').val()) {
            gafisa.alphabook.home.mapas.aoClicarLimparPosts();
            gafisa.alphabook.home.mapas.aoClicarFiltrarPosts();
        }
    }
};

$(document).ready(gafisa.alphabook.home.mapas.inicializar);
