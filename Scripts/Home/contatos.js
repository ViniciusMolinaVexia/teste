if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.contatos = {
    categoriasEscolhidas: [],

    inicializar: function () {
        gafisa.alphabook.home.contatos.registrarAcoes();
        gafisa.alphabook.home.contatos.registrarAcoesAbas();
        gafisa.alphabook.home.contatos.aplicarMascaras();
        gafisa.alphabook.home.contatos.configurarAutocompleteCidade();
        gafisa.alphabook.home.contatos.configurarJstreeFiltro();
    },

    registrarAcoes: function () {
        $(".tile-contatos").livequery('click', gafisa.alphabook.home.contatos.aoClicarTile);
        $("#btnBuscaContatoFiltro").livequery('click', function () {
            gafisa.alphabook.home.contatos.aoBuscar();
        });
        $("#letrasContato .letra").livequery('click', gafisa.alphabook.home.contatos.aoClicarLetra);
        $("#meusProjetos, #projetosSeguidos, #todoProjetos").livequery('click', gafisa.alphabook.home.contatos.aoClicarCheckBox);
        $(".seg-busca-contato #btnBuscaGeral").livequery('click', function () { gafisa.alphabook.home.contatos.aoBuscar(); });
        $('#termoBuscaGeral').onPressEnter(gafisa.alphabook.home.contatos.aoBuscar);
        $(".linkBoxContato").livequery('click', gafisa.alphabook.home.contatos.aoEditarContato);
        $("#btnAdicionarContato").livequery('click', gafisa.alphabook.home.contatos.aoClicarAdicionarContato);
        $("#TipoPessoa").livequery('change', gafisa.alphabook.home.contatos.aoSelecionarTipoPessoa);
        $("#btnSalvarContato").livequery('click', gafisa.alphabook.home.contatos.aoSalvarContato);
        $("#Estado").livequery('change', gafisa.alphabook.home.contatos.aoSelecionarEstado);
        $('#adicionarTelefoneContato').livequery('click', gafisa.alphabook.home.contatos.aoAdicionarTelefoneContato);
        $(".post-contatos-excluir").livequery('click', gafisa.alphabook.home.contatos.aoExcluirPost);
        $(".contato-leiaMais").livequery('click', gafisa.alphabook.home.contatos.aoClicarLeiaMais);
        $("#tipocategoria").livequery('click', gafisa.alphabook.home.contatos.aoAbrirCategorias);
        $(".box-pin-mapa-contato-ativo").livequery('click', gafisa.alphabook.home.contatos.aoAbrirLocalizacaoMapa);
        $("#tipoCategoriaFormulario").livequery('click', gafisa.alphabook.home.contatos.aoAbrirCategoriasFormulario);
        $("#tipocategoria").livequery('click', gafisa.alphabook.home.contatos.aoAbrirCategorias);
        $('#contatoConteudoDiv').livequery(function () { $('#contatoConteudoDiv').scroll(gafisa.alphabook.home.contatos.aoRolarAteOFimContatos); });
        $("#formSalvarContato a[id*='remover_']").livequery('click', function () { gafisa.alphabook.home.contatos.aoRemoverTelefoneContato($(this)); });

        $("#formSalvarContato input").onPressEnter(gafisa.alphabook.home.contatos.aoSalvarContato);

        $('#botaoCriarCompromisso').livequery('click', function () {
            var idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
            var idStatusProjeto = gafisa.alphabook.home.carrossel.obterIdStatusProjeto();
            var idContato = $('#IdContato').val();
            $.navegar.proximo(gafisa.alphabook.rotas.agenda.editarCompromisso, { projetoId: idProjeto, statusProjetoId: idStatusProjeto, contato: true }, function () { gafisa.alphabook.home.agenda.aoSelecionarContato(idContato); });
        });

        $('#Confidencialidade').livequery('change', gafisa.alphabook.home.contatos.aoAlterarConfidencialidade);

        $('#exportarContato, .ico-exporta-contato-box').livequery('click', gafisa.alphabook.home.contatos.exportarContato);

        $('#imprimirContatos').livequery('click', gafisa.alphabook.home.contatos.aoClicarImprimirContatos);

        $('#imprimirListaContato').livequery('click', gafisa.alphabook.home.contatos.aoImprimirContatos);
    },

    aoClicarImprimirContatos: function () {
        var data = gafisa.alphabook.home.contatos.obterFiltros();
        $.get(gafisa.alphabook.rotas.contatos.listarContatosT, data.model, function (html) {
            $('#modalImpressaoContato').html(html).modal('show');

            $.navegar.ajustarRodape();
        }, "html");
    },

    aoImprimirContatos: function () {
        $('#modalImpressaoContato').printArea({ mode: "popup", popClose: true });
    },    

    aoAbrirLocalizacaoMapa: function () {
        $.navegar.mapa($(this).attr('data-contatoId'), "contato");
    },

    aoSelecionarItemCategoria: function () {
        var checkPai = $('.jstree-undetermined').length;
        var check = $('.jstree-checked').length;
        var checkAll = checkPai + check;
        var texto = '';
        if (checkAll > 1) {
            texto = checkAll + ' Selecionados';
        } else {
            texto = $('.jstree-checked').data('categorianome');
        }

        if ($('.jstree-checked').length == 0)
            texto = 'Selecione';

        $('#opcaoCategoria').text(texto);

    },

    configurarJstreeFiltro: function () {
        $("#categorias").jstree({
            "themes": {
                "theme": "default",
                "dots": true,
                "icons": false
            },
            "plugins": ["themes", "checkbox", "html_data"]
        }).bind("check_node.jstree uncheck_node.jstree", gafisa.alphabook.home.contatos.aoSelecionarItemCategoria);
    },

    configurarJstreeFormulario: function () {
        $("#categoriasFormulario").jstree({
            "themes": {
                "theme": "default",
                "dots": true,
                "icons": false
            },
            "plugins": ["themes", "html_data"]
        });

        $("#categoriasFormulario .itemCategoria").livequery('click', gafisa.alphabook.home.contatos.aoSelecionarCategoria);
    },

    aoSelecionarCategoria: function () {
        var data = { categoriaId: $(this).data('categoriaid') };

        $.get(gafisa.alphabook.rotas.contatos.obterCategoria, data, gafisa.alphabook.home.contatos.aposSelecionarCategoriaId, 'json');
    },

    aposSelecionarCategoriaId: function (json) {
        var sel = $("#tipoCategoriaFormulario");

        sel.empty();
        sel.append('<option value="">Selecione</option>');
        sel.append('<option selected="selected" value="' + json.idCategoria + '" >' + json.nomeCategoria + '</option>');

        $('#categoriasFormulario').toggle();
    },

    aoAbrirCategorias: function () {
        $(this).blur();
        $('#categorias').toggle(function () {
            if ($('#categorias').attr('data-carregado')) {
                if ($('#categorias').attr('data-carregado') == "true") {
                    $('#categorias').attr('data-carregado', false);
                } else {
                    $('#categorias').attr('data-carregado', true);
                }
            } else {
                $('#categorias').attr('data-carregado', true);
            }
        }).css({
            left: ($(this).offset().left + 0) + 'px',
            top: ($(this).offset().top + 26) + 'px'
        });
    },

    aoAbrirCategoriasFormulario: function () {
        $(this).blur();
        $('#categoriasFormulario').toggle();
    },

    registrarAcoesAbas: function () {
        $('#abaDadosContato').livequery('click', $.navegar.ajustarRodape);
        $('#abaAgenda').livequery('click', $.navegar.ajustarRodape);
        $('#abaAvaliacoes').livequery('click', $.navegar.ajustarRodape);
        $('#abaPosts').livequery('click', $.navegar.ajustarRodape);
        $('#abaProjetos').livequery('click', $.navegar.ajustarRodape);

        $("#abaAvaliacoes").livequery('click', gafisa.alphabook.home.contatos.aoSelecionarAba);
        $("#abaPosts").livequery('click', gafisa.alphabook.home.contatos.aoSelecionarAba);
        $("#avaliarContato").livequery('click', gafisa.alphabook.home.contatos.aoAvaliarContato);
        $("#listarAvaliacoes").livequery('click', gafisa.alphabook.home.contatos.aoListarAvaliacoes);
        $('#texto').onPressEnter(gafisa.alphabook.home.contatos.aoListarAvaliacoes);
        $("#abaAgenda").livequery('click', gafisa.alphabook.home.contatos.aoSelecionarAba);
    },

    aplicarMascaras: function () {
        if ($("#TipoPessoa").val() != "Fisica")
            $("#CpfCnpj").livequery(function () { $(this).setMask({ mask: '99.999.999/9999-99', autoTab: false }); });
        else
            $("#CpfCnpj").livequery(function () { $(this).setMask({ mask: '999.999.999-99', autoTab: false }); });

        $("#CEP").livequery(function () { $(this).setMask({ mask: '99999-999', autoTab: false }); });
        $("#numero").livequery(function () { $(this).setMask({ mask: '9999999999', autoTab: false }); });
        $("input[id*='ddd_']").livequery(function () { $(this).setMask({ mask: '99', autoTab: false }); });
    },

    obterIdProjeto: function () {
        var projetoId = gafisa.alphabook.home.carrossel.obterIdProjeto();
        return projetoId == 0 ? null : projetoId;
    },

    aoClicarTile: function () {
        if (!$(this).hasClass('inativo')) {
            var idProjeto = gafisa.alphabook.home.contatos.obterIdProjeto();
            $.navegar.proximo(gafisa.alphabook.rotas.contatos.index, { projetoId: idProjeto, TileProjeto: idProjeto ? $('.tile-topo').html() : "" }, function () { gafisa.alphabook.home.contatos.aoExirTela(null); });
        }
    },

    aoExirTela: function (ids, data) {
        if (ids)
            $('.contatos-geral').data('ids', ids);

        gafisa.alphabook.home.contatos.configurarJstreeFiltro();
        gafisa.alphabook.home.contatos.aoBuscar();
    },

    aoBuscar: function () {
        if ($('#categorias').attr('data-carregado') == "true") {
            $('#categorias').toggle(function () {
                $('#categorias').attr('data-carregado', false);
            });
        }

        var conteudo = $("#contatoConteudoDiv");
        conteudo.fadeOut('fast', function () {

            $("#contatoConteudoDiv").html('<div class="loading-circulo"></div>');

            conteudo.fadeIn('fast', function () {
                var data = gafisa.alphabook.home.contatos.obterFiltros();
                $.get(gafisa.alphabook.rotas.contatos.listarContatos, data.model, gafisa.alphabook.home.contatos.aposBuscar, 'html');
            });

        });
    },

    obterFiltros: function (parametros) {
        var filtrado = false;

        var data = {};
        data.model = {};
        data.model.TiposContatosSelecionadas = [];

        var quantidadeChecados = $('.jstree-checked').length;

        for (var j = 0; j < quantidadeChecados; j++) {
            data.model.TiposContatosSelecionadas.push($('.jstree-checked')[j].id);
            filtrado = true;
        }

        data.model.IdProjeto = gafisa.alphabook.home.contatos.obterIdProjeto();

        if (!String.isNullOrEmpty($($('.letra.selecionada')[0]).text())) {
            data.model.Letra = $($('.letra.selecionada')[0]).text();
            filtrado = true;
        }

        if (!String.isNullOrEmpty($("#Estado").val())) {
            data.model.UfsSelecionados = $("#Estado").val();
            filtrado = true;
        }

        if (!String.isNullOrEmpty($("#termoBuscaGeral").val())) {
            data.model.TermoBusca = $("#termoBuscaGeral").val();
            filtrado = true;
        }

        data.model.MeusProjetos = $('#meusProjetos').length == 1 ? !String.isNullOrEmpty($('#meusProjetos').attr("checked")) : null;
        data.model.ProjetosSeguidos = $('#projetosSeguidos').length == 1 ? !String.isNullOrEmpty($('#projetosSeguidos').attr("checked")) : null;
        data.model.TodosProjetos = $('#todoProjetos').length == 1 ? !String.isNullOrEmpty($('#todoProjetos').attr("checked")) : null;
        data.model.Pagina = parametros && parametros.pagina ? parametros.pagina : 1;

        if (data.model.MeusProjetos || data.model.ProjetosSeguidos || data.model.TodosProjetos)
            filtrado = true;

        if ($('.contatos-geral').data('ids')) {
            filtrado = true;
            data.model.IdsContatos = $('.contatos-geral').data('ids');
            data.model.IdProjeto = null;
        }

        if (!String.isNullOrEmpty($(".cidadeContato").val())) {
            data.model.Cidade = $(".cidadeContato").data('id');
            filtrado = true;
        }

        if (filtrado) {
            $('#imprimirContatos').removeClass('hide');
        } else {
            if (!$('#imprimirContatos').hasClass('hide'))
                $('#imprimirContatos').addClass('hide');
        }

        return data;
    },

    aoClicarLetra: function () {
        var letraatual = $($('#letrasContato .selecionada')[0]).html();
        $($('.letra.selecionada')[0]).removeClass('selecionada');

        if (letraatual != $(this).html()) $(this).addClass('selecionada');

        gafisa.alphabook.home.contatos.aoBuscar();
    },

    aposBuscar: function (html) {
        $('#contatoConteudoDiv').removeData('carregando');
        var conteudo = $("#contatoConteudoDiv");
        conteudo.fadeOut('fast', function () {
            $("#contatoConteudoDiv").html(html);
            conteudo.fadeIn();
            $.navegar.ajustarRodape();
        });
    },

    aoClicarCheckBox: function () {
        var lida = $(this).attr("checked") == "checked" ? false : true;

        if (lida) {
            $(this).attr("checked", "checked");
        }
        else {
            $(this).removeAttr("checked");
        }
    },

    aoEditarContato: function (e, contatoId, data) {
        if (!contatoId)
            contatoId = $(this).attr('data-contatoId');

        avaliacaoId = $(this).attr('data-avaliacaoId');

        $.navegar.proximo(gafisa.alphabook.rotas.contatos.editarContato, { contatoId: contatoId, avaliacaoId: avaliacaoId, projetoId: gafisa.alphabook.home.contatos.obterIdProjeto() },
            function () { gafisa.alphabook.home.contatos.aposClicarAdicionarEditarContato(data); });
    },

    abrirContato: function (contatoId) {
        var avaliacaoId = null;

        $.navegar.proximo(gafisa.alphabook.rotas.contatos.editarContato, { contatoId: contatoId, avaliacaoId: avaliacaoId, projetoId: gafisa.alphabook.home.contatos.obterIdProjeto() },
        gafisa.alphabook.home.contatos.aposClicarAdicionarEditarContato);
    },

    aoClicarAdicionarContato: function (data) {
        $.navegar.proximo(gafisa.alphabook.rotas.contatos.adicionarContato, { projetoId: gafisa.alphabook.home.contatos.obterIdProjeto() }, function () { gafisa.alphabook.home.contatos.aposClicarAdicionarEditarContato(data); });
    },

    aposClicarAdicionarEditarContato: function (data) {

        if (data)
            gafisa.alphabook.home.contatos.preencherDadosEndereco(data);

        gafisa.alphabook.home.contatos.configurarJstreeFormulario();
        gafisa.alphabook.home.contatos.aplicarMascaras();
        gafisa.alphabook.home.contatos.configurarAutocompleteCidade();
        $("#formContatoProjetos .ui-multiselect").hide();
        gafisa.alphabook.home.contatos.carregarPermissoes();
    },

    preencherDadosEndereco: function (data) {
        if (data.endereco) {
            $('#CEP').val(data.endereco.cep);
            $('#Numero').val(data.endereco.numero);
            gafisa.alphabook.util.obterEndereco(data.endereco.cep);
            $('#btnSalvarContato').data('inclusaomap', true);

            $('#hddLatitude', '#formSalvarContato').val(data.latitude);
            $('#hddLongitude', '#formSalvarContato').val(data.longitude);
        }
    },

    aoSalvarContato: function () {
        if (!String.isNullOrEmpty($('#CpfCnpj').val()) || !String.isNullOrEmpty($('#CRECI').val()))
            gafisa.alphabook.home.contatos.validarCpfCnpj();
        else
            gafisa.alphabook.home.contatos.salvarContato();
    },

    validarCpfCnpj: function () {
        var data = {};
        data.model = $("#formSalvarContato").formToJSON();
        data.model.IdContato = $('#IdContato').val();
        $.ajax({
            url: gafisa.alphabook.rotas.contatos.validarCpfCnpj,
            type: "POST",
            data: JSON.stringify(data.model),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.contatos.aposVerificarCpfCnpj
        });
    },

    aposVerificarCpfCnpj: function (json) {
        if (json.cpfCnpjExiste) {
            var msg;

            if (json.novoCadastro) {
                msg = json.creci ? gafisa.mensagens.comum.desejaAtualizarCreci : gafisa.mensagens.comum.desejaAtualizarCpfCnpj;

                $.dialogo.confirmar(msg, gafisa.alphabook.home.contatos.salvarContato, null);
            } else {
                msg = json.creci ? gafisa.mensagens.contatos.creciJaCadastrado : gafisa.mensagens.contatos.cpfCnpjJaCadastrado;

                gafisa.alphabook.mensagens.exibirMensagemErro(msg.format(json.nomeContato));
            }
        } else {
            gafisa.alphabook.home.contatos.salvarContato();
        }
    },

    salvarContato: function () {
        if (gafisa.alphabook.home.contatos.validar()) {
            var data = {};
            data.model = $("#formSalvarContato").formToJSON();
            data.model.CidadeId = $("#cidade").data('id');
            data.model.Cidade = $("#cidade").val();
            data.model.Estado = $("#Estado").val();
            data.model.IdContato = $('#IdContato').val();
            data.model.NomeTipoContato = $("#tipoCategoriaFormulario option:selected").text();
            data.model.IdTipoContato = $("#tipoCategoriaFormulario").val();
            data.model.Telefones = [];
            data.model.Projeto = {};
            data.model.Projeto.Id = gafisa.alphabook.home.carrossel.obterIdProjeto();

            data.model.Lat = $("#hddLatitude").val();
            data.model.Long = $("#hddLongitude").val();

            var divsTelefones = $("div[id*='ddd_telefone_']");

            $.each(divsTelefones, function (index, element) {
                var idTelefone = $(element).attr('data-idTelefone');
                var descricaoTipoTelefone = $(element).find('select option:selected').text();
                var tipoTelefone = $($(element).find('select')[0]).val();
                var ddd = $($(element).find('input')[0]).val();
                var telefone = $($(element).find('input')[1]).val();

                if (!String.isNullOrEmpty(ddd) || !String.isNullOrEmpty(telefone))
                    data.model.Telefones.push({ Id: idTelefone, DDD: ddd, Numero: telefone, IdTipoTelefone: tipoTelefone, DescricaoTipoTelefone: descricaoTipoTelefone });
            });

            var endereco = $('#Endereco').val();
            var numero = $('#Numero').val();
            var bairro = $('#Bairro').val();
            var estado = $('#Estado').val();
            var cidade = $('#cidade').val();

            data.model.Confidencialidade = $("#Confidencialidade").val();
            if ($('#usuariosConfidencialidade option').val() != null && $('#usuariosConfidencialidade option').val() != '') {
                data.model.UsuariosConfidencialidadeIds = [];
                $('#usuariosConfidencialidade option').each(function (i, e) {
                    data.model.UsuariosConfidencialidadeIds.push($(e).val());
                });
            }

            if (!String.isNullOrEmpty(endereco) && !String.isNullOrEmpty(numero) && !String.isNullOrEmpty(bairro) && !String.isNullOrEmpty(estado) && !String.isNullOrEmpty(cidade)) {
                var busca = "{0}, {1} - {2}, {3} - {4}".format(endereco, numero, bairro, cidade, estado);
                $.maps.getLocationFromAddress(busca, null, gafisa.alphabook.home.contatos.aposPesquisarLocalizacaoContato, data);
            }
            else {

                $.loading({ action: 'show' });

                $.ajax({
                    url: gafisa.alphabook.rotas.contatos.salvarContato,
                    type: "POST",
                    data: JSON.stringify(data.model),
                    cache: false,
                    contentType: 'application/json',
                    success: gafisa.alphabook.home.contatos.aposSalvarContato
                });
            }
        }
    },

    aposPesquisarLocalizacaoContato: function (location, sucesso, parameters) {

        $.loading({ action: 'show' });

        if (sucesso) {
            parameters.model.Latitude = location.lat();
            parameters.model.Longitude = location.lng();
        }

        $.ajax({
            url: gafisa.alphabook.rotas.contatos.salvarContato,
            type: "POST",
            data: JSON.stringify(parameters.model),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.contatos.aposSalvarContato
        });
    },

    aposSalvarContato: function (json) {

        $.loading({ action: 'hide' });

        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvosComSucesso.format('Dados do contato'));
            var idProjeto = gafisa.alphabook.home.contatos.obterIdProjeto();

            if ($('#btnSalvarContato').data('inclusaomap')) {
                $.navegar.mapa(json.id, 'contato', idProjeto);
            } else {
                $.navegar.proximo(gafisa.alphabook.rotas.contatos.index, { projetoId: idProjeto, TileProjeto: idProjeto ? $('.tile-topo').html() : "" }, gafisa.alphabook.home.contatos.aoExirTela);
            }
        } else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros[0]);
    },

    aoSelecionarTipoPessoa: function () {
        if ($(this).val() == "Fisica")
            $("#CpfCnpj").livequery(function () { $(this).setMask({ mask: '999.999.999-99', autoTab: false }); });
        else
            $("#CpfCnpj").livequery(function () { $(this).setMask({ mask: '99.999.999/9999-99', autoTab: false }); });
    },

    configurarAutocompleteCidade: function () {

        if ($("#Estado").val() == "") {
            gafisa.alphabook.home.contatos.desabilitarCampoCidade(true);
            return;
        }

        gafisa.alphabook.home.contatos.desabilitarCampoCidade(false);

        $(".cidadeContato").autocomplete({
            open: function () {
                setTimeout(function () {
                    $('.ui-autocomplete').css('z-index', 289);
                }, 0);
            },
            source: gafisa.alphabook.home.contatos.carregarDadosAutocomplete,
            minLength: 2,
            select: function (event, ui) {
                $(".cidadeContato").data('id', ui.item.Id);
            }
        });
    },

    desabilitarCampoCidade: function (bool) {
        $(".cidadeContato").disable(bool);
        if (bool)
            $(".cidadeContato").val('');
    },

    carregarDadosAutocomplete: function (request, response) {
        $.ajax({
            url: gafisa.alphabook.rotas.contatos.listarCidadesAutocomplete,
            type: "POST",
            dataType: "json",
            data: { chave: $(".cidadeContato").val(), uf: $("#Estado").val() },
            success: function (data) {
                response($.map(data, function (item) {
                    return { label: item.value, value: item.value, Id: item.key };
                }));
            }
        });
    },

    aoSelecionarEstado: function () {
        $(".cidadeContato").val('');
        if (String.isNullOrEmpty($("#Estado").val())) {
            gafisa.alphabook.home.contatos.desabilitarCampoCidade(true);
        } else {
            gafisa.alphabook.home.contatos.configurarAutocompleteCidade();
        }
    },

    aoAdicionarTelefoneContato: function () {
        var divsTelefone = $("div[id*='ddd_telefone_']");
        var dropdownTipoTelefone = divsTelefone.find('div').html().replace('Tipo Telefone:', '');

        var divConteudo = "<div data-idTelefone=\"" + 0 + "\" class=\"sep-line-form\" style=\"display:none;\" id=\"ddd_telefone_" + divsTelefone.length + "\">" +
                        "	<div class=\"form-line form-tipo-tel\">" +
                        "	</div>" +
                        "	<div class=\"form-line form-ddd\">" +
                        "		<input type=\"text\" id=\"ddd_" + divsTelefone.length + "\" />" +
                        "	</div>" +
                        "	<div class=\"form-line form-tel\">" +
                        "		<input class=\"campo-telefone\" type=\"text\" id=\"telefone_" + divsTelefone.length + "\" />" +
                        "		<a class=\"form-bt-remove\" href=\"javascript:void(0);\" id=\"remover_" + divsTelefone.length + "\" >Remover</a>" +
                        "	</div>" +
                        "</div>";

        divsTelefone.last().after(divConteudo);
        var ultimoTelefone = $('#ddd_telefone_' + divsTelefone.length);
        ultimoTelefone.find('div').first().html(dropdownTipoTelefone);
        ultimoTelefone.find('div select').attr('id', 'tipoTelefone_' + divsTelefone.length);
        
        ultimoTelefone.fadeIn(function () {
            var fundo = $('#aba-dados').length == 0 ? $('.bg-branco-no-float.form-add-contato-no-float') : $('#aba-dados');
            fundo.css('height', ((+fundo.css('height').replace('px', '')) + 45 + $("[id*='dd_telefone_']").length) + 'px');
            $.navegar.ajustarRodape();
        });
        

        gafisa.alphabook.home.contatos.aplicarMascaras();
    },

    aoRemoverTelefoneContato: function (link) {
        var divTelefoneContato = link.parent().parent();

        divTelefoneContato.fadeOut('fast', function () {
            $(this).remove();
            $.navegar.ajustarRodape();
        });
    },

    validar: function () {

        if (String.isNullOrEmpty($('#NomeContato').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('O campo Nome'));
            return false;
        }

        var cpfCnpjNulo = String.isNullOrEmpty($('#CpfCnpj').val());
        var pessoFisica = $("#TipoPessoa").val() == "Fisica";

        if (!cpfCnpjNulo) {
            if (pessoFisica) {
                if (!gafisa.alphabook.validar.cpf($('#CpfCnpj').val())) {
                    gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerValido.format('Cpf'));
                    return false;
                }
            } else {
                if (!gafisa.alphabook.validar.cnpj($('#CpfCnpj').val())) {
                    gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerValido.format('Cnpj'));
                    return false;
                }
            }
        }

        if (String.isNullOrEmpty($('#tipoCategoriaFormulario').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('O campo Categoria de contato'));
            return false;
        }

        if (String.isNullOrEmpty($('#Confidencialidade').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('O campo Confidencialidade'));
            return false;
        } else if ($('#Confidencialidade').val() == 'Departamento') {
            if (String.isNullOrEmpty($('#IdDepartamentoConfidencialidade').val())) {
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('O campo Departamento'));
                return false;
            }
        } else if ($('#Confidencialidade').val() == 'UsuariosEspecificos') {
            if (String.isNullOrEmpty($('#usuariosConfidencialidade').val())) {
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('O campo Usuários'));
                return false;
            }
        }

        if (!gafisa.alphabook.home.contatos.validarListaDeTelefones()) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerValido.format('Telefone'));
            return false;
        }

        return true;
    },

    validarListaDeTelefones: function () {
        var divsTelefones = $("div[id*='ddd_telefone_']");
        var retorno = true;

        $.each(divsTelefones, function (index, element) {
            var ddd = $($(element).find('input')[0]).val();
            var telefone = $($(element).find('input')[1]).val();

            if (!String.isNullOrEmpty(ddd) || !String.isNullOrEmpty(telefone)) {
                if (!gafisa.alphabook.validar.telefone('(' + ddd + ') ' + telefone) || !gafisa.alphabook.validar.ddd(ddd))
                    retorno = false;
            }
        });

        return retorno;
    },

    configurarAutoCompleteUsuarios: function () {
        $('#usuariosConfidencialidade').fcbkcomplete({
            json_url: gafisa.alphabook.rotas.usuario.listarPorNomeAutocomplete,
            cache: true,
            newel: false,
            maxitems: 999,
            complete_text: "Digite o nome de um usuario",
            width: 622,
            bricket: false
        });

        var usuarios = $('#confidencialidadeUsuarios').data('source');

        if (typeof (usuarios) == 'string' && usuarios != '')
            usuarios = JSON.parse(usuarios);

        if (usuarios != null && usuarios != undefined && usuarios != '') {
            $.each(usuarios, function (index, value) {
                $('#usuariosConfidencialidade').trigger('addItem', [{ 'title': value.Nome + ' ' + value.Sobrenome, 'value': value.Id }]);
            });
        }

        $.navegar.ajustarRodape();
    },

    aoAlterarConfidencialidade: function () {
        if ($(this).val() == 'Publico') {
            $('#confidencialidadeDepartamento').css('display', 'none');
            $('#confidencialidadeUsuarios').css('display', 'none');
        } else if ($(this).val() == 'Departamento') {
            $('#confidencialidadeDepartamento').css('display', 'block');
            $('#confidencialidadeUsuarios').css('display', 'none');
        } else if ($(this).val() == 'UsuariosEspecificos') {
            $('#confidencialidadeDepartamento').css('display', 'none');
            $('#confidencialidadeUsuarios').css('display', 'block');
        }
    },

    aoSelecionarAba: function () {
        var aba = $(this).attr('aba');
        var action = null;
        var parametros = {};
        var callback = null;

        if (aba === 'aba-avaliacoes') {
            action = gafisa.alphabook.rotas.contatos.contatoAvaliacao;
            callback = gafisa.alphabook.home.contatos.aoExibirAbaAvaliacoes;
            parametros = { contatoId: $('#IdContato').val(), avaliacaoId: $('#IdAvaliacao').val(), projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto() };
        }

        if (aba === 'aba-posts') {
            var homeInicial = gafisa.alphabook.home.carrossel.obterIdProjeto() == 0;
            action = gafisa.alphabook.rotas.contatos.listarPostsContato;
            callback = gafisa.alphabook.home.contatos.aoExibirAbaPost;
            parametros = { contatoId: $('#IdContato').val(), homeInicial: homeInicial };
        }

        if (aba == 'aba-agenda') {
            action = gafisa.alphabook.rotas.contatos.agenda;
            callback = gafisa.alphabook.home.contatos.aoExibirAbaAgenda;
            parametros = { contatoId: $('#IdContato').val(), idProjeto: gafisa.alphabook.home.carrossel.obterIdProjeto() };
        }

        if (action != null && !$('#' + aba).data('carregado'))
            gafisa.alphabook.home.contatos.carregarAba(aba, action, parametros, callback);
    },

    carregarAba: function (idAba, action, parametros, callback) {
        var aba = $('#' + idAba);
        aba.data('carregado', true);
        aba.fadeOut('fast', function () {
            aba.html('<div class="loading-circulo"></div>');
            aba.fadeIn('fast', function () {
                $.get(action, parametros, function (html) {
                    aba.fadeOut('fast', function () {
                        aba.html(html);
                        aba.fadeIn('fast', function () {
                            $.navegar.ajustarRodape();
                            if (callback)
                                callback();
                        });
                    });
                }, "html");
            });
        });
    },

    carregarPermissoes: function () {
        var secao = null;
        var acao = gafisa.alphabook.autorizacao.acao.visualizar;
        var idprojeto = gafisa.alphabook.home.contatos.obterIdProjeto();

        if (idprojeto != null && idprojeto > 0)
            secao = gafisa.alphabook.autorizacao.secao.homeProjeto;
        else
            secao = gafisa.alphabook.autorizacao.secao.homeInicial;

        var podeVisualizarDadosContato = gafisa.alphabook.autorizacao.usuarioPossuiPermissao(secao, gafisa.alphabook.autorizacao.funcionalidade.contatosDadosContato, acao);
        var podeVisualizarAgenda = gafisa.alphabook.autorizacao.usuarioPossuiPermissao(secao, gafisa.alphabook.autorizacao.funcionalidade.contatosAgenda, acao);
        var podeVisualizarAvaliacao = gafisa.alphabook.autorizacao.usuarioPossuiPermissao(secao, gafisa.alphabook.autorizacao.funcionalidade.contatosAvaliações, acao);
        var podeVisualizarPost = gafisa.alphabook.autorizacao.usuarioPossuiPermissao(secao, gafisa.alphabook.autorizacao.funcionalidade.contatosPost, acao);

        if (!podeVisualizarDadosContato && podeVisualizarAgenda) {
            gafisa.alphabook.home.contatos.carregarAba('aba-agenda',
                gafisa.alphabook.rotas.contatos.agenda,
                { contatoId: $('#IdContato').val(), idProjeto: gafisa.alphabook.home.carrossel.obterIdProjeto() },
                gafisa.alphabook.home.contatos.aoExibirAbaAgenda);
            return;
        }

        if (!podeVisualizarDadosContato && !podeVisualizarAgenda && podeVisualizarAvaliacao) {
            gafisa.alphabook.home.contatos.carregarAba('aba-avaliacoes',
                gafisa.alphabook.rotas.contatos.contatoAvaliacao,
                { contatoId: $('#IdContato').val(), avaliacaoId: $('#IdAvaliacao').val(), projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto() },
                gafisa.alphabook.home.contatos.aoExibirAbaAvaliacoes);
            return;
        }

        if (!podeVisualizarDadosContato && !podeVisualizarAgenda && !podeVisualizarAvaliacao && podeVisualizarPost) {
            var homeInicial = gafisa.alphabook.home.carrossel.obterIdProjeto() == 0;
            gafisa.alphabook.home.contatos.carregarAba('aba-posts',
                gafisa.alphabook.rotas.contatos.listarPostsContato, { contatoId: $('#IdContato').val(), homeInicial: homeInicial },
                gafisa.alphabook.home.contatos.aoExibirAbaPost);
            return;
        }
    },

    aoExibirAbaPost: function () {
        $.navegar.ajustarRodape();
    },

    aoExibirAbaAgenda: function () {
        var idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
        idProjeto = idProjeto == 0 ? null : idProjeto;

        $('#tabelaAgenda').tabela({ action: gafisa.alphabook.rotas.agenda.listarCompromissos, tamanhoPagina: 10, parametros: { ordenacao: 1, tipo: 1, pagina: 1, homeProjeto: false, idProjeto: idProjeto, tamanhoPagina: 10, tipoInterface: 2, idContato: $('#IdContato').val() } });
    },

    validarAvaliacao: function () {

        if (String.isNullOrEmpty($('#IdContato').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('Código'));
            return false;
        }

        if (String.isNullOrEmpty($('#txtComentarioAvaliacaoContato').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('O campo comentário'));
            return false;
        }
        return true;
    },

    aoExibirAbaAvaliacoes: function () {
        var idProjeto = gafisa.alphabook.home.contatos.obterIdProjeto();
        $('#tabelaAvaliacoes').tabela({ action: gafisa.alphabook.rotas.contatos.listarAvaliacoes, parametros: { projetoId: idProjeto, contatoId: $('#IdContato').val() }, tamanhoPagina: 6 });
    },

    aoListarAvaliacoes: function () {
        var idProjeto = gafisa.alphabook.home.contatos.obterIdProjeto();
        $('#tabelaAvaliacoes').tabela({ acao: "carregar", parametros: { projetoId: idProjeto, contatoId: $('#IdContato').val(), texto: $('#texto').val(), tipoNota: $('#tipoNota').val() == null ? "-1" : $('#tipoNota').val() } });
    },

    aoAvaliarContato: function () {
        if (gafisa.alphabook.home.contatos.validarAvaliacao()) {
            var data = {
                avaliacaoId: $('#IdAvaliacao').val(),
                contatoId: $('#IdContato').val(),
                nota: $('input[name=notas]:checked', '#form-avaliacao').val(),
                comentario: $('#txtComentarioAvaliacaoContato').val()
            };

            $.post(gafisa.alphabook.rotas.contatos.avaliar, data, gafisa.alphabook.home.contatos.aposAvaliarContato, 'json');
        }
    },

    aposAvaliarContato: function (json) {
        var secao = null;
        var acao = gafisa.alphabook.autorizacao.acao.adicionar;
        var idprojeto = gafisa.alphabook.home.contatos.obterIdProjeto();

        if (idprojeto != null && idprojeto > 0)
            secao = gafisa.alphabook.autorizacao.secao.homeProjeto;
        else
            secao = gafisa.alphabook.autorizacao.secao.homeInicial;

        var podeSalvar = gafisa.alphabook.autorizacao.usuarioPossuiPermissao(secao, gafisa.alphabook.autorizacao.funcionalidade.contatosAvaliações, acao);


        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Avaliação'));

            $.ajax({
                url: gafisa.alphabook.rotas.contatos.carregarAvaliacaoNotas,
                type: 'GET',
                dataType: 'json',
                data: { contatoId: $('#IdContato').val() },
                success: function (json) {
                    if (json.sucesso) {
                        $('#avaliacaoNotas').html(json.notas);
                        $('#avaliacaoMedia').html(json.media);
                    } else
                        gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
                }
            });

            $('#txtComentarioAvaliacaoContato, #IdAvaliacao').val('');
            $('input:radio[name=notas]').filter('[value=2]').prop('checked', true);
            $('#avaliarContato').text('Salvar');
            if (!podeSalvar)
                $('#avaliarContato').hide();
            gafisa.alphabook.controles.scrollToAnchor('anchor');

            $('#tabelaAvaliacoes').tabela({ acao: "carregar" });
        }
        else {
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
        }
    },

    aoRolarAteOFimContatos: function () {

        if ($('#contatoConteudoDiv').data('carregando') || $('#contatoConteudoDiv').data('fim')) return;

        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            $('#contatoConteudoDiv').data('carregando', true);
            var data = gafisa.alphabook.home.contatos.obterFiltros({ pagina: Math.ceil(($('.line-contatos').length / 3)) + 1 });
            $.get(gafisa.alphabook.rotas.contatos.listarContatos, data.model, gafisa.alphabook.home.contatos.aposRolarAteOFim, 'html');
        }
    },

    aposRolarAteOFim: function (html) {
        if (html.contains('msg-sem-retorno')) {
            $('#contatoConteudoDiv').data('fim', true);
        } else {
            $('#contatoConteudoDiv').append(html);
            $('#contatoConteudoDiv').removeData('carregando');
        }
    },

    aoExcluirPost: function () {
        var post = $(this).parent();
        $.dialogo.confirmar(gafisa.mensagens.comum.desejaExcluir, function () { gafisa.alphabook.home.contatos.aoConfirmarExclusaoPost(post); });
    },

    aoConfirmarExclusaoPost: function (post) {
        $.loading({ action: 'show' });
        $.ajax({
            type: "GET",
            dataType: "json",
            url: gafisa.alphabook.rotas.timeline.excluirPostagem,
            data: { postagemId: post.data('id') },
            success: function (json) {
                $(post).fadeOut('fast', function () {
                    $(this).parent().remove();
                });
                $.loading({ action: 'hide' });
            },
            error: function () {
                $.loading({ action: 'hide' });
            }
        });
    },

    aoClicarLeiaMais: function () {
        var id = $(this).attr('data-postagemId');
        var homeInicial = gafisa.alphabook.home.carrossel.obterIdProjeto() == 0;
        $.dialogo.exibir(gafisa.alphabook.rotas.timeline.carregarDetalhePost, { idPost: id, homeInicial: homeInicial });
    },

    exportarContato: function (e) {
        e.preventDefault();
        var data = {};
        data.contatoId = $('#IdContato').length == 0 ? $(this).parent().find('.linkBoxContato').data('contatoid') : $('#IdContato').val();

        window.location.href = gafisa.alphabook.rotas.contatos.exportar.concatQueryString(data);
    }
};

// Contato Avaliação

gafisa.alphabook.home.contatos.avaliacao = {
    inicializar: function () {
        gafisa.alphabook.home.contatos.avaliacao.registrarAcoes();
    },

    registrarAcoes: function () {
        $('.editar-avaliacao').livequery('click', gafisa.alphabook.home.contatos.avaliacao.aoEditarAvaliacao);
        $('.excluir-avaliacao').livequery('click', gafisa.alphabook.home.contatos.avaliacao.aoExcluirAvaliacao);
    },

    aoEditarAvaliacao: function () {
        $('#avaliarContato').text('Alterar');
        var data = { contatoId: $('#IdContato').val(), avaliacaoId: $(this).data('avaliacaoid') };
        $.get(gafisa.alphabook.rotas.contatos.obterAvaliacao, data, gafisa.alphabook.home.contatos.avaliacao.aposEditarAvaliacao);
    },

    aoExcluirAvaliacao: function () {
        var avaliacao = $(this);
        $.dialogo.confirmar(gafisa.mensagens.comum.desejaExcluir, function () { gafisa.alphabook.home.contatos.avaliacao.aoConfirmarExclusaoAvaliacao(avaliacao); });
    },

    aoConfirmarExclusaoAvaliacao: function (avaliacao) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: gafisa.alphabook.rotas.contatos.excluirAvaliacao,
            data: { avaliacaoId: avaliacao.attr('data-avaliacaoId'), contatoId: $('#IdContato').val() },
            success: function (json) {
                $(avaliacao).fadeOut('fast', function () {
                    $(this).parent().parent().remove();
                });

                gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidaComSucesso.format('Avaliação'));

                $.ajax({
                    url: gafisa.alphabook.rotas.contatos.carregarAvaliacaoNotas,
                    type: 'GET',
                    dataType: 'json',
                    data: { contatoId: $('#IdContato').val() },
                    success: function (json) {
                        if (json.sucesso) {
                            $('#avaliacaoNotas').html(json.notas);
                            $('#avaliacaoMedia').html(json.media);
                        } else
                            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
                    }
                });
            },
            error: function () {
            }
        });
    },

    aposEditarAvaliacao: function (json) {
        $('#avaliarContato').show();
        if (json.sucesso) {
            $('#txtComentarioAvaliacaoContato').val(json.avaliacao.Comentario);
            $('#IdAvaliacao').val(json.avaliacao.AvaliacaoContatoId);
            $('input:radio[name=notas]').filter('[value=' + json.avaliacao.Nota + ']').prop('checked', true);
            gafisa.alphabook.controles.scrollToAnchor('anchor');
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
    }

};

// FIM: Contato Avaliação

$(document).ready(function () {
    gafisa.alphabook.home.contatos.inicializar();
    gafisa.alphabook.home.contatos.avaliacao.inicializar();
});

