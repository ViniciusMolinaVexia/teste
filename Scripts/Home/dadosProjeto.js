if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.dadosProjeto = {
    inicializar: function () {
        gafisa.alphabook.home.dadosProjeto.registrarAcoes();
        gafisa.alphabook.home.dadosProjeto.configurar();
    },

    configurar: function () {
        $("#CEP").livequery(function () { $(this).setMask({ mask: '99999-999', autoTab: false }); });
        $("#numero").livequery(function () { $(this).setMask({ mask: '9999999999', autoTab: false }); });
    },

    registrarAcoes: function () {
        // Dados do projeto //
        $('#abaDadosTerreno').livequery('click', $.navegar.ajustarRodape);
        $('#tileDadosProjeto').livequery('click', gafisa.alphabook.home.dadosProjeto.aoClicarTile);
        $('#editarDadosProjeto').livequery('click', gafisa.alphabook.home.dadosProjeto.aoEditarDadosProjeto);
        $('#editarResponsavelProjeto').livequery('click', gafisa.alphabook.home.dadosProjeto.aoEditarResponsavelProjeto);
        $('#exportarDadosProjeto').livequery('click', gafisa.alphabook.home.dadosProjeto.aoExportarDadosProjeto);
        $('#botaoSalvarDadosProjeto').livequery('click', gafisa.alphabook.home.dadosProjeto.aoSalvarDadosProjeto);
        $('#historicoStatusProjeto').livequery('click', gafisa.alphabook.home.dadosProjeto.aoVisualizarHistoricoStatusProjeto);
        $('#historicoResponsavelProjeto').livequery('click', gafisa.alphabook.home.dadosProjeto.aoVisualizarHistoricoResponsavelProjeto);
        $('#historicoNomeProjeto').livequery('click', gafisa.alphabook.home.dadosProjeto.aoVisualizarHistoricoNomeProjeto);
        $('.linkCodigoProjeto').livequery('click', gafisa.alphabook.home.dadosProjeto.aoClicarNoCodigoDoProjeto);
        $('.modal-editar-nome #nome').onPressEnter(gafisa.alphabook.home.dadosProjeto.aoSalvarDadosProjeto);

        // Cobrança de Documentação // 
        $('#cobrarDocumentacao').livequery('click', gafisa.alphabook.home.dadosProjeto.aoCobrarDocumentacao);
        $('[name="opcaoDocumento"]').livequery('click', gafisa.alphabook.home.dadosProjeto.aoSelecionarDocumento);
        $('#botaoEnviarDocumentacao').livequery('click', gafisa.alphabook.home.dadosProjeto.aoEnviarCobrancaDocumentacao);

        // Tabs //
        $('.tabDadosProjeto').livequery(gafisa.alphabook.home.dadosProjeto.aoVisualizarTabs);

        // Dados do Terreno //
        $('#abaDadosTerreno').livequery('click', $.navegar.ajustarRodape);
        $('#adicionarMatricula').livequery('click', gafisa.alphabook.home.dadosProjeto.aoAdicionarMatriculaArea);
        $("a[id*='remover_']").livequery('click', function () { gafisa.alphabook.home.dadosProjeto.aoRemoverMatriculaArea($(this)); });
        $('#Estado').livequery('change', function () { gafisa.alphabook.home.dadosProjeto.aoAlterarEstado(true); });
        $('#EstadoSecundario').livequery('change', function () { gafisa.alphabook.home.dadosProjeto.aoAlterarEstado(false); });
        $('.editar-poligono').livequery(function () { $(this).on('click', gafisa.alphabook.home.dadosProjeto.aoEditarPoligono); });
        $('#botaoSalvarDadosTerreno').livequery('click', gafisa.alphabook.home.dadosProjeto.aoSalvarDadosTerreno);
        $('#formDadosTerreno input').onPressEnter(gafisa.alphabook.home.dadosProjeto.aoSalvarDadosTerreno);
        $('#botaoAdicionarCidadeSecundaria').livequery('click', gafisa.alphabook.home.dadosProjeto.aoAdicionarCidadeSecundaria);
        $('#botaoRemoverCidadeSecundaria').livequery('click', gafisa.alphabook.home.dadosProjeto.aoRemoverCidadeSecundaria);

        // Fases do projeto //
        $('#abaFases').livequery('click', $.navegar.ajustarRodape);
        $('#abaFases').livequery('click', function () { gafisa.alphabook.home.dadosProjeto.aoSelecionarAba('aba-fases'); });
        $('#botaoAdicionarFase').livequery('click', gafisa.alphabook.home.dadosProjeto.aoAdicionarFase);
        $('#editarResponsavelFase').livequery('click', gafisa.alphabook.home.dadosProjeto.aoEditarResponsavelFase);
        $('#salvarFase').livequery('click', gafisa.alphabook.home.dadosProjeto.aoSalvarFase);
        $('#nomeFaseProjeto').onPressEnter(gafisa.alphabook.home.dadosProjeto.aoSalvarFase);
        $('.coordenadaProjeto').livequery('click', gafisa.alphabook.home.dadosProjeto.aoClicarCoordenadaProjeto);

        // Passagem //
        $('#abaPassagem').livequery('click', $.navegar.ajustarRodape);
        $('#abaPassagem').livequery('click', function () { gafisa.alphabook.home.dadosProjeto.aoSelecionarAba('aba-passagem'); });
        $('#botaoEfetuarPassagem').livequery('click', gafisa.alphabook.home.dadosProjeto.aoEfetuarPassagem);
        $('#botaoSalvarPassagem').livequery('click', gafisa.alphabook.home.dadosProjeto.aoSalvarPassagem);

        // Contatos Principais //
        $('#abaContatos').livequery('click', $.navegar.ajustarRodape);
        $('#abaContatos').livequery('click', function () { gafisa.alphabook.home.dadosProjeto.aoSelecionarAba('aba-contatos'); });
        $('#botaoAssociarcontatoPrincipal').livequery('click', gafisa.alphabook.home.dadosProjeto.aoAssociarContatoPrincipal);
        $('[name="botaoDissociarContatoProjeto"]').livequery('click', gafisa.alphabook.home.dadosProjeto.aoDissociarContato);
        $('#botaoSalvarContatoPrincipal').livequery('click', gafisa.alphabook.home.dadosProjeto.aoSalvarContatoMaster);
        $('#listaContatosPrincipais').livequery(function () { $('#listaContatosPrincipais').scroll(gafisa.alphabook.home.dadosProjeto.aoRolarAteOFimContatos); });

        // Informações de contrato //
        $('#abaInformacoesContrato').livequery('click', $.navegar.ajustarRodape);
        $('#abaInformacoesContrato').livequery('click', function () { gafisa.alphabook.home.dadosProjeto.aoSelecionarAba('aba-informacoes'); });
        $('#adicionarAdiantamento').livequery('click', gafisa.alphabook.home.dadosProjeto.aoAdicionarAdiantamento);
        $("a[name*='remover_adiantamento']").livequery('click', function () { gafisa.alphabook.home.dadosProjeto.aoRemoverAdiantamento($(this)); });
        $('#botaoSalvarInformacoesContrato').livequery('click', gafisa.alphabook.home.dadosProjeto.aoSalvarInformacoesContrato);
        $('#formInforamacoesContrato input').onPressEnter(gafisa.alphabook.home.dadosProjeto.aoSalvarInformacoesContrato);

        // Ata de Reunião //
        $('#abaAtaReuniao').livequery('click', $.navegar.ajustarRodape);
        $('#abaAtaReuniao').livequery('click', function () { gafisa.alphabook.home.dadosProjeto.aoSelecionarAba('aba-ata-reuniao'); });
        $('#formAtaReuniao #PrivacidadeId').livequery('change', gafisa.alphabook.home.dadosProjeto.aoSelecionarPrivacidadeAtaReuniao);
        $('#formAtaReuniao #divParticipantesAtaReuniao').livequery(gafisa.alphabook.home.dadosProjeto.configurarAutoCompleteParticipantesAtaReuniao);
        $('#formAtaReuniao #divUsuariosEspecificosAtaReuniao').livequery(gafisa.alphabook.home.dadosProjeto.configurarAutoCompleteUsuariosAtaReuniao);
        $('#formAtaReuniao #Data').livequery(function () { $(this).datepicker(); });
        $('#botaoSalvarAtaReuniao').livequery('click', gafisa.alphabook.home.dadosProjeto.aoSalvarAtaReuniao);
        $('#aba-ata-reuniao .listar-ata-reuniao .botaoEditarAtaReuniao').livequery('click', function () {
            gafisa.alphabook.home.dadosProjeto.carregarEdicaoAtaReuniao($(this).data('id'));
        });
        $("#aba-ata-reuniao .listar-ata-reuniao").livequery('scroll', gafisa.alphabook.home.dadosProjeto.aoRolarAtasReunioesAteOFim);
        $('#formAtaReuniao input').onPressEnter(gafisa.alphabook.home.dadosProjeto.aoSalvarAtaReuniao);

        // inteligência de Mercado //
        $('#abaInteligencia').livequery('click', $.navegar.ajustarRodape);
        $('#abaInteligencia').livequery('click', function () { gafisa.alphabook.home.dadosProjeto.aoSelecionarAba('aba-inteligencia'); });

        // Dados Financeiros //
        $('#abaDadosFinanceiros').livequery('click', $.navegar.ajustarRodape);
        $('#abaDadosFinanceiros').livequery('click', function () { gafisa.alphabook.home.dadosProjeto.aoSelecionarAba('aba-dados-financeiros'); });

        $('#textBoxAUSA').livequery(function () { $('#textBoxAUSA').blur(function (event) { gafisa.alphabook.home.dadosProjeto.aoAlterarValorParceria(event); }); });
        $('#textBoxProprietario').livequery(function () { $('#textBoxProprietario').blur(function (event) { gafisa.alphabook.home.dadosProjeto.aoAlterarValorParceria(event); }); });

        $('#textBoxConsorcioAUSA').livequery(function () { $('#textBoxConsorcioAUSA').blur(function (event) { gafisa.alphabook.home.dadosProjeto.aoAlterarValorConsorcio(event); }); });
        $('#textBoxSocio').livequery(function () { $('#textBoxSocio').blur(function (event) { gafisa.alphabook.home.dadosProjeto.aoAlterarValorConsorcio(event); }); });

        $('#tabelaDadosFinanceiros tbody tr.linha-uso').livequery(function () {
            $.each($(this).find('td'), function (index, element) {
                $(element).find('input:text').blur(function () { gafisa.alphabook.home.dadosProjeto.aoAlterarValorTabela(index); });
            });
        });

        $('.campo-lucro-receita').livequery('blur', gafisa.alphabook.home.dadosProjeto.aoAlterarReceitaLucro);
        $('.campo-vgv-ausa').livequery('blur', gafisa.alphabook.home.dadosProjeto.aoAlterarVGVAUSA);
        $('.campo-vgv').livequery('blur', gafisa.alphabook.home.dadosProjeto.aoAlterarVGV);
        $('.campo-formula-vgv').livequery('blur', gafisa.alphabook.home.dadosProjeto.calcularVGVProprietarioSocio);

        $('#botaoSalvar').livequery('click', gafisa.alphabook.home.dadosProjeto.aoSalvarDadosFinanceiros);
        $('#aba-dados-financeiros input').onPressEnter(gafisa.alphabook.home.dadosProjeto.aoSalvarDadosFinanceiros);
        $('#exportarDadosFinanceiros').livequery('click', gafisa.alphabook.home.dadosProjeto.aoExportarDadosFinanceiros);
        $('#botaoAdicionarUso').livequery('click', gafisa.alphabook.home.dadosProjeto.aoAdicionarUso);

        // Centro de Custo //
        $('#abaCentroCusto').livequery('click', $.navegar.ajustarRodape);
        $('#abaCentroCusto').livequery('click', function () { gafisa.alphabook.home.dadosProjeto.aoSelecionarAba('aba-centro-custo'); });
        $('#botaoAdicionarCentroCusto').livequery('click', gafisa.alphabook.home.dadosProjeto.aoAdicionarCentroCusto);
        $('.botaoEditarCentroCusto').livequery('click', gafisa.alphabook.home.dadosProjeto.aoEditarCentroCusto);
        $('#salvarCentroCusto').livequery('click', gafisa.alphabook.home.dadosProjeto.aoSalvarCentroCusto);
        $('#formCentroCusto input').onPressEnter(gafisa.alphabook.home.dadosProjeto.aoSalvarCentroCusto);
        $('#DataCriacao').livequery(function () {
            $(this).datepicker();
        });
    },

    // abas //
    aoSelecionarAba: function (aba) {
        var action = null;
        var parametros = {};
        var callback = null;

        if (aba === 'aba-fases') {
            action = gafisa.alphabook.rotas.projeto.fasesProjeto;
            callback = gafisa.alphabook.home.dadosProjeto.aoExibirAbaFases;
            parametros = { idProjeto: $('#tituloDadosProjeto').data('id') };
        } else if (aba === 'aba-passagem') {
            action = gafisa.alphabook.rotas.projeto.passagemProjeto;
            callback = gafisa.alphabook.home.dadosProjeto.aoExibirAbaPassagem;
            parametros = { idProjeto: $('#tituloDadosProjeto').data('id') };
        } else if (aba === 'aba-contatos') {
            action = gafisa.alphabook.rotas.projeto.contatosProjeto;
            callback = gafisa.alphabook.home.dadosProjeto.aoExibirAbaContato;
            parametros = { idProjeto: $('#tituloDadosProjeto').data('id') };
        } else if (aba === 'aba-informacoes') {
            action = gafisa.alphabook.rotas.projeto.informacoesContrato;
            callback = gafisa.alphabook.home.dadosProjeto.aoExibirInformacaoesContrato;
            parametros = { idProjeto: $('#tituloDadosProjeto').data('id') };
        } else if (aba === 'aba-ata-reuniao') {
            action = gafisa.alphabook.rotas.projeto.ataReuniao;
            callback = gafisa.alphabook.home.dadosProjeto.aoExibirAtaReuniao;
            parametros = { idProjeto: $('#tituloDadosProjeto').data('id') };
        } else if (aba === 'aba-inteligencia') {
            action = gafisa.alphabook.rotas.projeto.inteligenciaMercado;
            parametros = { idProjeto: $('#tituloDadosProjeto').data('id') };
        } else if (aba === 'aba-dados-financeiros') {
            action = gafisa.alphabook.rotas.projeto.dadosFinanceiros;
            callback = gafisa.alphabook.home.dadosProjeto.aoExibirDadosFinanceiros;
            parametros = { idProjeto: $('#tituloDadosProjeto').data('id') };
        } else if (aba === 'aba-centro-custo') {
            action = gafisa.alphabook.rotas.projeto.centroCusto;
            callback = gafisa.alphabook.home.dadosProjeto.aoExibirCentroCusto;
            parametros = { idProjeto: $('#tituloDadosProjeto').data('id') };
        }

        if (action != null && !$('#' + aba).data('carregado'))
            gafisa.alphabook.home.dadosProjeto.carregarAba(aba, action, parametros, callback);
    },

    aoExibirInformacaoesContrato: function () {
        $('#formInforamacoesContrato .info-data').livequery(function () { $(this).datepicker(); });
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

                            if (callback) {
                                callback();
                            }
                            $.navegar.ajustarRodape();
                        });
                    });
                }, "html");
            });
        });
    },

    aoVisualizarTabs: function () {
        var abaSelecionada = $('[aria-selected="true"]').attr('aria-controls');
        if (!abaSelecionada.contains('aba-dados')) {
            gafisa.alphabook.home.dadosProjeto.aoSelecionarAba(abaSelecionada);
        }
    },

    // Tile //
    aoClicarTile: function () {
        if (!$(this).hasClass('inativo')) {
            $.navegar.proximo(gafisa.alphabook.rotas.projeto.dadosProjeto, { id: $('.tile-topo').data('id') });
        }
    },

    // Dados Projeto //
    atualizarDadosProjeto: function () {
        $.get(gafisa.alphabook.rotas.projeto.obterDadosProjeto, { id: $('#tituloDadosProjeto').data('id') }, function (html) {
            $('.header-dados-projeto').html(html);
        }, "html");
    },

    aoEditarDadosProjeto: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.projeto.editarDadosProjeto, { id: $('#tituloDadosProjeto').data('id') });
    },

    aoEditarResponsavelProjeto: function () {
        $.dialogo.selecionarUsuario(gafisa.alphabook.home.dadosProjeto.aoSelecionarUsuarioResponsavel);
    },

    aoExportarDadosProjeto: function (e) {
        e.preventDefault();
        window.location.href = gafisa.alphabook.rotas.projeto.obterRelatorioDadosProjeto.concatQueryString({ idProjeto: $('#tituloDadosProjeto').data('id'), codigoProjeto: $('.linkCodigo').text() });
    },

    aoSelecionarUsuarioResponsavel: function (usuario) {
        var id = $(usuario).data('id');
        var imagem = $(usuario).find('img').attr('src');
        var nome = $(usuario).data('nome');

        $.dialogo.voltar(function () {
            $('#dadosResponsavel').data('id', id);

            $('#imagemResponsavel').fadeOut('fast', function () {
                $('#imagemResponsavel').attr('src', imagem);
                $('#imagemResponsavel').attr('alt', nome);
                $('#imagemResponsavel').fadeIn();
            });

            $('#nomeResponsavel').fadeOut('fast', function () {
                $('#nomeResponsavel').html(nome);
                $('#nomeResponsavel').fadeIn();
            });

        });
    },

    aoSalvarDadosProjeto: function () {
        if (!gafisa.alphabook.home.dadosProjeto.validarDadosProjeto()) return;

        var data = new Object();
        data.model = $('#formDadosProjeto').formToJSON();
        data.model.id = $('#tituloDadosProjeto').data('id');
        data.model.ResponsavelId = $('#dadosResponsavel').data('id');
        data.model.CodigoProjeto = $($('.info-dados-projeto')[0]).find('span').html();
        data.model.StatusProjetoId = $('#dropdownStatusProjeto').val().split('|')[0];
        data.model.DepartamentoId = $('#dropdownStatusProjeto').val().split('|')[1];
        data.model.Status = $('#dropdownStatusProjeto option:selected').text();
        if ($('input[name=Comite]:checked').val() == "1")
            data.model.Comite = true;
        else if ($('input[name=Comite]:checked').val() == "0")
            data.model.Comite = false;

        $.ajax({
            url: gafisa.alphabook.rotas.projeto.salvarDadosProjeto,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.dadosProjeto.aposSalvarDadosProjeto
        });
    },

    validarDadosProjeto: function () {
        if (String.isNullOrEmpty($('#nome').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('Nome'));
            return false;
        }

        if (String.isNullOrEmpty($('#dadosResponsavel').data('id')) || $('#dadosResponsavel').data('id') == 0) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('Responsável'));
            return false;
        }

        return true;
    },

    aposSalvarDadosProjeto: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvosComSucesso.format('Dados do projeto'));
            gafisa.alphabook.home.dadosProjeto.atualizarDadosProjeto();
        } else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros[0]);

        $.dialogo.fechar();
    },

    aoVisualizarHistoricoStatusProjeto: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.projeto.visualizarHistoricoStatusProjeto, null, gafisa.alphabook.home.dadosProjeto.aoExibirHistoricoStatusProjeto);
    },

    aoVisualizarHistoricoResponsavelProjeto: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.projeto.visualizarHistoricoResponsavelProjeto, null, gafisa.alphabook.home.dadosProjeto.aoExibirHistoricoResponsavelProjeto);
    },

    aoVisualizarHistoricoNomeProjeto: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.projeto.visualizarHistoricoNomeProjeto, null, gafisa.alphabook.home.dadosProjeto.aoExibirHistoricoNomeProjeto);
    },

    aoExibirHistoricoNomeProjeto: function () {
        $('#tableHistoriconomeProjeto').tabela({ action: gafisa.alphabook.rotas.projeto.listarHistoricoNomeProjeto, parametros: { projetoId: $('#tituloDadosProjeto').data('id') }, tamanhoPagina: 5 });
    },

    aoExibirHistoricoStatusProjeto: function () {
        $('#tableHistoricoStatusProjeto').tabela({ action: gafisa.alphabook.rotas.projeto.listarHistoricoStatusProjeto, parametros: { projetoId: $('#tituloDadosProjeto').data('id') }, tamanhoPagina: 5 });
    },

    aoExibirHistoricoResponsavelProjeto: function () {
        $('#tableHistoricoResponsavelProjeto').tabela({ action: gafisa.alphabook.rotas.projeto.listarHistoricoReponsavelProjeto, parametros: { projetoId: $('#tituloDadosProjeto').data('id') }, tamanhoPagina: 5 });
    },

    aoClicarNoCodigoDoProjeto: function () {
        var id = $(this).data('id');
        window.location.href = gafisa.alphabook.rotas.home.index + 'Home/Index/' + id;
    },

    // Cobrança de documentação //

    aoCobrarDocumentacao: function () {
        $.loading({ action: 'show' });
        $.dialogo.exibir(gafisa.alphabook.rotas.projeto.cobrarDocumentacao, { idProjeto: $('#tituloDadosProjeto').data('id') }, function () { $.loading({ action: 'hide' }); });
    },

    aoEnviarCobrancaDocumentacao: function () {
        if ($('[name="opcaoDocumento"]:checked').length == 0) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.selecionePeloMenosUm.format('Documento'));
            return;
        }
        var data = {};
        data.Descricao = $('#conteudoCobranca').val();
        data.Assunto = $('#conteudoCobranca').data('assunto');
        data.EmailDestinatario = $('#conteudoCobranca').data('email');
        data.IdProjeto = $('#tituloDadosProjeto').data('id');

        $.loading({ action: 'show' });

        $.ajax({
            url: gafisa.alphabook.rotas.projeto.enviarCobrancaDocumentacao,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.dadosProjeto.aposEnviarCobrancaDocumentacao
        });
    },

    aposEnviarCobrancaDocumentacao: function (json) {
        if (json.sucesso) {
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.enviadaComSucesso.format('Cobrança'));
        } else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros[0]);


        var idProjeto = $('#tituloDadosProjeto').data('id');
        $.dialogo.fechar(function () { $.navegar.proximo(gafisa.alphabook.rotas.projeto.dadosProjeto, { id: idProjeto }, null, true); });
    },

    aoSelecionarDocumento: function () {
        var motivos = '';

        $('[name="opcaoDocumento"]').each(function () {
            if ($(this).is(":checked"))
                motivos = motivos + '\n' + " - " + $(this).attr('texto') + " - " + $(this).val();
            else
                motivos.toString().replace($(this).attr('texto') + " - " + $(this).val(), '');
        });

        var conteudoEmail = $('#conteudoCobranca').data('conteudo').replace('[opcoes]', motivos);

        $('#conteudoCobranca').val(conteudoEmail);
    },

    // Dados Terreno //
    aoAdicionarMatriculaArea: function () {
        var divsMatriculaArea = $("div[id*='matricula_area_']");

        var divConteudo = "<div class=\"sep-line-form\" style=\"display:none;\" id=\"matricula_area_" + divsMatriculaArea.length + "\">" +
                          "  <div class=\"form-line form-matriculas\">" +
                          "    <input type=\"text\" id=\"matricula_" + divsMatriculaArea.length + "\" class=\"campo-inteiro\" />" +
                          "  </div>" +
                          "  <div class=\"form-line form-area\">" +
                          "    <input type=\"text\" id=\"area_" + divsMatriculaArea.length + "\" class=\"campo-valor\" />" +
                          "    <a class=\"form-bt-remove\" href=\"javascript:void(0);\" id=\"remover_" + divsMatriculaArea.length + "\" >Remover</a>" +
                          "  </div>" +
                          "</div>";

        divsMatriculaArea.last().after(divConteudo);
        $('#matricula_area_' + divsMatriculaArea.length).fadeIn();
        $.navegar.ajustarRodape();
    },

    aoRemoverMatriculaArea: function (link) {
        var divMatriculaArea = link.parent().parent();

        divMatriculaArea.fadeOut('fast', function () {
            $(this).remove();
        });
    },

    aoAlterarEstado: function (principal) {
        $(principal ? '#cidade' : '#cidadeSecundaria').val('');
        gafisa.alphabook.home.dadosProjeto.configurarAutoCompleteCidade(principal);
    },

    configurarAutoCompleteCidade: function (principal) {
        var estado = principal ? $('#Estado') : $('#EstadoSecundario');
        var cidade = principal ? $('#cidade') : $('#cidadeSecundaria');
        var source = principal ? gafisa.alphabook.home.dadosProjeto.carregarDadosAutocomplete : gafisa.alphabook.home.dadosProjeto.carregarDadosAutocompleteCidadeSecundaria;

        if (estado.val() == '') {
            cidade.disable(true).data('id', null);
        } else {
            cidade.autocomplete({
                open: function () {
                    setTimeout(function () {
                        $('.ui-autocomplete').css('z-index', 289);
                    }, 0);
                },
                source: source,
                minLength: 2,
                select: function (event, ui) {
                    cidade.data('id', ui.item.Id);
                }
            });
            cidade.disable(false);
        }
    },

    carregarDadosAutocomplete: function (request, response) {
        $.ajax({
            url: gafisa.alphabook.rotas.home.listarCidadesAutocomplete,
            type: "POST",
            dataType: "json",
            data: { chave: $("#cidade").val(), uf: $("#Estado").val() },
            success: function (data) {
                response($.map(data, function (item) {
                    return { label: item.value, value: item.value, Id: item.key };
                }));
            }
        });
    },

    carregarDadosAutocompleteCidadeSecundaria: function (request, response) {
        $.ajax({
            url: gafisa.alphabook.rotas.home.listarCidadesAutocomplete,
            type: "POST",
            dataType: "json",
            data: { chave: $("#cidadeSecundaria").val(), uf: $("#EstadoSecundario").val() },
            success: function (data) {
                response($.map(data, function (item) {
                    return { label: item.value, value: item.value, Id: item.key };
                }));
            }
        });
    },

    aoSalvarDadosTerreno: function () {
        var data = new Object();
        data.model = $('#formDadosTerreno').formToJSON();
        data.model.Id = $('#formDadosTerreno').data('id');
        data.model.AreaTotal = $('#areaTotal').val().replaceAll('.', '');
        data.model.CidadeId = $('#cidade').data('id');
        data.model.Matriculas = [];
        data.model.Coordenadas = $("#areaPoligono").data('coordenadas');
        data.model.AreaPoligono = $("#areaPoligono").text().replaceAll('.', '');
        data.model.IdProjeto = $('#tituloDadosProjeto').data('id');

        if (!$('#divCidadeSecundaria').hasClass('hide'))
            data.model.CidadeSecundariaId = $('#cidadeSecundaria').data('id');

        var divsMatriculaArea = $("div[id*='matricula_area_']");

        $.each(divsMatriculaArea, function (index, element) {
            var matricula = $($(element).find('input')[0]).val();
            var area = $($(element).find('input')[1]).val();

            if (!String.isNullOrEmpty(matricula) || !String.isNullOrEmpty(area))
                data.model.Matriculas.push({ Valor: matricula, Area: area.replaceAll('.', '') });
        });

        //Validar
        if (data.model.CidadeId == '' || $('#cidade').val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerSelecionado.format('Cidade'));
            return false;
        }


        $.ajax({
            url: gafisa.alphabook.rotas.projeto.salvarDadosTerreno,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.dadosProjeto.aposSalvarDadosTerreno
        });
    },

    aposSalvarDadosTerreno: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvosComSucesso.format('Dados do terreno'));
        } else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros[0]);
    },

    aoAdicionarCidadeSecundaria: function () {
        $('#divCidadeSecundaria').removeClass('hide');
        $.navegar.ajustarRodape();
    },

    aoRemoverCidadeSecundaria: function () {
        $('#divCidadeSecundaria').addClass('hide');

        $('#EstadoSecundario').val('');
        $('#cidadeSecundaria').val('').disable(true).data('id', null);
    },

    // Fases //
    aoExibirAbaFases: function () {
        $('#tabelaFasesProjeto').tabela({ action: gafisa.alphabook.rotas.projeto.listarFasesProjeto, parametros: { projetoId: $('#tituloDadosProjeto').data('id') }, tamanhoPagina: 5, callback: function () { $('.seg-footer').css('top', '750px'); } });
    },

    aoAdicionarFase: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.projeto.adicionarFaseProjeto);
    },

    aoEditarResponsavelFase: function () {
        $.dialogo.selecionarUsuario(gafisa.alphabook.home.dadosProjeto.aoSelecionarUsuarioResponsavel);
    },

    aoExibirResponsaveisFase: function () {
        gafisa.alphabook.home.dadosProjeto.listarUsuariosResponsaveis();
    },

    aoSalvarFase: function () {
        if (!gafisa.alphabook.home.dadosProjeto.validarFaseProjeto()) return;

        var data = {};
        data.model = {};
        data.model.NomeProjeto = $('#nomeFaseProjeto').val();
        data.model.IdResponsavel = $('#dadosResponsavel').data('id');
        data.model.IdProjeto = $('#tituloDadosProjeto').data('id');

        $.ajax({
            url: gafisa.alphabook.rotas.projeto.salvarFaseProjeto,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.dadosProjeto.aposSalvarFaseProjeto
        });
    },

    validarFaseProjeto: function () {
        if (String.isNullOrEmpty($('#nomeFaseProjeto').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('Nome'));
            return false;
        }

        if (String.isNullOrEmpty($('#dadosResponsavel').data('id'))) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('Responsável'));
            return false;
        }

        return true;
    },

    aposSalvarFaseProjeto: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Fase do projeto'));
            $('#tabelaFasesProjeto').tabela({ acao: "carregar" });
            $.dialogo.fechar();
        } else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);

        $('.seg-footer').css('top', '750px');
    },

    aoClicarCoordenadaProjeto: function () {
    },

    // Passagem //
    aoExibirAbaPassagem: function () {
        $('#tabelaPassagem').tabela(
        {
            action: gafisa.alphabook.rotas.projeto.listarPassagemProjeto,
            parametros: { projetoId: $('#tituloDadosProjeto').data('id'), tamanhoPagina: 8 },
            tamanhoPagina: 8
        });
    },

    aoEfetuarPassagem: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.projeto.efetuarPassagem);
    },

    aoSalvarPassagem: function () {
        if (!gafisa.alphabook.home.dadosProjeto.validarPassagem()) return;

        $.loading({ action: 'show' });
        var data = new Object();
        data.model = $('#formPassagem').formToJSON();
        data.model.IdProjeto = $('#tituloDadosProjeto').data('id');

        $.ajax({
            url: gafisa.alphabook.rotas.projeto.salvarPassagemProjeto,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.dadosProjeto.aposSalvarPassagem
        });
    },

    validarPassagem: function () {
        if (String.isNullOrEmpty($('#departamentos').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerSelecionado.format('Departamento'));
            return false;
        }

        return true;
    },

    aposSalvarPassagem: function (json) {
        $.loading({ action: 'hide' });
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.feitaComSucesso.format('Passagem'));
            var idProjeto = $('#tituloDadosProjeto').data('id');
            $.dialogo.fechar(function () { $.navegar.proximo(gafisa.alphabook.rotas.projeto.dadosProjeto, { id: idProjeto }, null, true); });

        } else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);
    },

    // Contatos Principais //
    aoExibirAbaContato: function () {
        gafisa.alphabook.home.dadosProjeto.carregarContatos();
    },

    carregarContatos: function () {
        var conteudo = $('.seg-contatos-principais');
        conteudo.fadeOut('fast', function () {
            conteudo.html('<div class="loading-circulo"></div>');
            conteudo.fadeIn('fast', function () {
                $.get(gafisa.alphabook.rotas.projeto.listarContatos, { projetoId: $('#tituloDadosProjeto').data('id'), pagina: 1 }, function (html) {
                    conteudo.fadeOut('fast', function () {
                        conteudo.html(html);
                        conteudo.fadeIn('fast', $.navegar.ajustarRodape);
                    });

                }, "html");
            });
        });
    },

    aoRolarAteOFimContatos: function () {
        if ($('#listaContatosPrincipais').data('carregando') || $('#listaContatosPrincipais').data('fim')) return;

        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            $('#listaContatosPrincipais').data('carregando', true);
            var pagina = Math.ceil(($('.box-contato-sel').length / 6)) + 1;
            $.get(gafisa.alphabook.rotas.contatos.listarContatos, { projetoId: $('#tituloDadosProjeto').data('id'), pagina: pagina }, function () {
                if (html.contains('msg-sem-retorno')) {
                    $('#listaContatosPrincipais').data('fim', true);
                } else {
                    $('#listaContatosPrincipais').append(html);
                    $('#listaContatosPrincipais').removeData('carregando');
                }
            }, 'html');
        }
    },

    aoSalvarContatoMaster: function () {
        var idContato = $('input[name="contato"]:checked').val();
        if (idContato == null) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.selecioneUm.format('contato'));
            return;
        }

        var data = {};
        data.projetoId = $('#tituloDadosProjeto').data('id');
        data.idContato = idContato;

        $.ajax({
            url: gafisa.alphabook.rotas.projeto.salvarContatoMaster,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: function (json) {
                if (json.sucesso) {
                    gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Contato principal'));
                    gafisa.alphabook.home.dadosProjeto.carregarContatos();
                } else
                    gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);
            }
        });
    },

    aoAssociarContatoPrincipal: function () {
        $.dialogo.selecionarContato({ tipo: 'contato', aoSelecionar: gafisa.alphabook.home.dadosProjeto.aoSelecionarContato });
    },

    aoSelecionarContato: function (idContato) {

        var data = {};
        data.projetoId = $('#tituloDadosProjeto').data('id');
        data.idContato = idContato;

        $.ajax({
            url: gafisa.alphabook.rotas.projeto.associarContato,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: function (json) {
                if (json.sucesso) {
                    gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Contato principal'));
                    gafisa.alphabook.home.dadosProjeto.carregarContatos();
                } else {
                    gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);
                }
            }
        });
    },

    aoDissociarContato: function () {
        var data = {};
        data.projetoId = $('#tituloDadosProjeto').data('id');
        data.idContato = $(this).data('id');

        $.ajax({
            url: gafisa.alphabook.rotas.projeto.dissociarContato,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: function (json) {
                if (json.sucesso) {
                    gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Conto principal'));
                    gafisa.alphabook.home.dadosProjeto.carregarContatos();
                } else {
                    gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);
                }
            }
        });
    },

    // Informações de contrato //

    aoAdicionarAdiantamento: function () {
        var divsAdiantamento = $("div[id*='adiantamento_']");

        var divConteudo = "<div class=\"sep-line-form\" id=\"adiantamento_" + divsAdiantamento.length + "\" style=\"display:none;\">" +
                            "<div class=\"form-line inf-seq\">" +
                                "<label>Seq.:</label>" +
                                "<input type=\"text\" name=\"sequencia\" class=\"campo-inteiro\" />" +
                            "</div>" +
                            "<div class=\"form-line inf-data\">" +
                                "<label>Data aditamento:</label>" +
                                "<input type=\"text\" name=\"dataAdiantamento\" class=\"info-data\" />" +
                            "</div>" +
                            "<div class=\"form-line inf-particularidades-2\">" +
                                "<label>Particularidades do aditamento:</label>" +
                                "<textarea name=\"particularidadesAdiantamento\"></textarea>" +
                                "<a class=\"form-bt-remove\" href=\"javascript:void(0);\" name=\"remover_adiantamento\">Remover</a>" +
                            "</div>" +
                          "</div>";

        divsAdiantamento.last().after(divConteudo);
        $('#adiantamento_' + divsAdiantamento.length).fadeIn();
        $.navegar.ajustarRodape();
    },

    aoRemoverAdiantamento: function (link) {
        var divAdiantament = link.parent().parent();

        divAdiantament.fadeOut('fast', function () {
            $(this).remove();
        });
    },

    validarInformacoesContrato: function () {
        if (!String.isNullOrEmpty($('#dataAssinatura').val())) {
            if (!gafisa.alphabook.validar.data($('#dataAssinatura').val())) {
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerValida.format('Data assinatura'));
                return false;
            }
        }

        var camposDataAdiantamento = $('[name="dataAdiantamento"]');
        $.each(camposDataAdiantamento, function (index, element) {
            if (!String.isNullOrEmpty($(element).val())) {
                if (!gafisa.alphabook.validar.data($(element).val())) {
                    gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerValida.format('Data andiantamento'));
                    return false;
                }
            }
        });

        return true;
    },

    aoSalvarInformacoesContrato: function () {
        if (!gafisa.alphabook.home.dadosProjeto.validarInformacoesContrato()) return;

        var data = new Object();

        data.model = $('#formInforamacoesContrato').formToJSON();
        data.model.Id = $('#formInforamacoesContrato').data('id');
        data.model.IdProjeto = $('#tituloDadosProjeto').data('id');

        data.model.Adiantamentos = [];

        var divsAdiantamento = $("div[id*='adiantamento_']");
        $.each(divsAdiantamento, function (index, element) {
            var sequencia = $($(element).find('[name="sequencia"]')).val();
            var dataAdiantamento = $($(element).find('[name="dataAdiantamento"]')).val();
            var particularidades = $($(element).find('[name="particularidadesAdiantamento"]')).val();

            if (!String.isNullOrEmpty(sequencia) || !String.isNullOrEmpty(dataAdiantamento) || !String.isNullOrEmpty(particularidades))
                data.model.Adiantamentos.push({ Sequencia: sequencia, DataAdiantamento: dataAdiantamento, Particularidades: particularidades });
        });

        $.ajax({
            url: gafisa.alphabook.rotas.projeto.salvarInformacoesContrato,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.dadosProjeto.aposSalvarInformacoesContrato
        });
    },

    aposSalvarInformacoesContrato: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvasComSucesso.format('Informações de contrato'));
            $('#formInforamacoesContrato').data('id', json.id);
        } else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);
    },

    // Ata de Reunião //
    aoExibirAtaReuniao: function () {
    },

    aoSelecionarPrivacidadeAtaReuniao: function () {
        var privacidadeId = $("#formAtaReuniao #PrivacidadeId").val();

        if (privacidadeId == 3) {
            $('#formAtaReuniao #divUsuariosEspecificosAtaReuniao').hide();
            $("#formAtaReuniao #divDepartamentoPrivacidade").show();
        }
        else if (privacidadeId == 5) {
            $("#formAtaReuniao #divDepartamentoPrivacidade").hide();
            $('#formAtaReuniao #divUsuariosEspecificosAtaReuniao').show();
        }
        else {
            $("#formAtaReuniao #divDepartamentoPrivacidade").hide();
            $('#formAtaReuniao #divUsuariosEspecificosAtaReuniao').hide();
        }
    },

    configurarAutoCompleteUsuariosAtaReuniao: function () {
        $('#formAtaReuniao #usuariosEspecificosAtaReuniao').fcbkcomplete({
            json_url: gafisa.alphabook.rotas.postagem.listarUsuariosEspecificos,
            cache: true,
            newel: false,
            maxitems: 999,
            complete_text: 'Digite o nome de um usuário',
            width: 662,
            bricket: false
        });
    },

    configurarAutoCompleteParticipantesAtaReuniao: function () {
        $('#formAtaReuniao #participantesAtaReuniao').fcbkcomplete({
            json_url: gafisa.alphabook.rotas.postagem.listarUsuariosEspecificos,
            cache: true,
            newel: true,
            maxitems: 999,
            complete_text: 'Digite o nome de um participante',
            width: 400,
            bricket: false
        });
    },

    validarAtaReuniao: function () {
        var inclusao = $('#formAtaReuniao #Id').val() == '0';

        if ($("#formAtaReuniao #Titulo").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatorio.format('Título'));
            return false;
        }

        if (inclusao && $("#formAtaReuniao #Data").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatoria.format('Data da reunião'));
            return false;
        }

        if (inclusao && !gafisa.alphabook.validar.data($('#formAtaReuniao #Data').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerValida.format('Data da reunião'));
            return false;
        }

        if (inclusao && $("#formAtaReuniao #participantesAtaReuniao").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatorio.format('Participantes'));
            return false;
        }

        if (inclusao && $("#formAtaReuniao #PrivacidadeId").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatoria.format('Confidencialidade'));
            return false;
        }

        if (inclusao && $("#formAtaReuniao #PrivacidadeId").val() == 5) {
            var usuarios = $('#formAtaReuniao #usuariosEspecificosAtaReuniao').val();

            if (usuarios == null || usuarios == '') {
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.selecionePeloMenosUm.format('usuário'));
                return false;
            }
        }

        if ($("#formAtaReuniao #Conteudo").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatorio.format('Conteúdo'));
            return false;
        }

        return true;
    },

    aoSalvarAtaReuniao: function () {
        if (!gafisa.alphabook.home.dadosProjeto.validarAtaReuniao()) return;

        var data = $('#formAtaReuniao').formToJSON();

        data.Participantes = $('#participantesAtaReuniao option').map(function () { return $(this).text(); }).toArray();
        data.ProjetoId = $('#tituloDadosProjeto').data('id');

        $.ajax({
            url: gafisa.alphabook.rotas.projeto.salvarAtaReuniao,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.dadosProjeto.aposSalvarAtaReuniao
        });
    },

    aposSalvarAtaReuniao: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.home.dadosProjeto.carregarEdicaoAtaReuniao();
            gafisa.alphabook.home.dadosProjeto.listarAtasReunioes(1);
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Ata de Reunião'));
        } else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);
    },

    carregarEdicaoAtaReuniao: function (id) {
        var url = gafisa.alphabook.rotas.projeto.editarAtaReuniao;
        var data = { projetoId: $('#tituloDadosProjeto').data('id'), id: id };

        $.get(url, data, function (html) {
            $('#aba-ata-reuniao .editar-ata-reuniao').html(html);
        }, 'html');
    },

    listarAtasReunioes: function (pagina, scroll) {
        var url = gafisa.alphabook.rotas.projeto.listarAtasReunioes;
        var data = { projetoId: $('#tituloDadosProjeto').data('id'), pagina: pagina };

        $.get(url, data, function (html) {
            var container = $('#aba-ata-reuniao .listar-ata-reuniao');

            if (scroll === true) {
                if (String.isNullOrWhiteSpace(html)) {
                    container.data('fim', true);
                } else {
                    container.append(html);
                    container.removeData('carregando');
                }
            } else {
                container.removeData('carregando');
                container.removeData('fim');
                container.html(html);
                container.scrollTop(0);
            }

        }, 'html');
    },

    aoRolarAtasReunioesAteOFim: function () {
        var container = $(this);

        if (container.data('carregando') || container.data('fim') || container.find('.item-ata-reuniao').length < 5) return;

        if (container.scrollTop() + container.innerHeight() >= container[0].scrollHeight) {
            container.data('carregando', true);

            var pagina = Math.ceil(container.find('.item-ata-reuniao').length / 5) + 1;

            gafisa.alphabook.home.dadosProjeto.listarAtasReunioes(pagina, true);
        }
    },

    // Dados financeiros //

    aoExibirDadosFinanceiros: function () {
        $.navegar.ajustarRodape();

        gafisa.alphabook.home.dadosProjeto.aoAlterarValorParceria({ which: 10 });
        gafisa.alphabook.home.dadosProjeto.aoAlterarValorConsorcio({ which: 10 });

        gafisa.alphabook.home.dadosProjeto.aoAlterarReceitaLucro();
        gafisa.alphabook.home.dadosProjeto.aoAlterarVGVAUSA();
        gafisa.alphabook.home.dadosProjeto.aoAlterarVGV();

        if (gafisa.alphabook.home.dadosProjeto.ocultarColunas === true) {
            $('#tabelaDadosFinanceiros .negocios-ocultar').hide();
            $('#tabelaDadosFinanceiros .negocios-colspan').attr('colspan', 1);
        }
    },

    aoAlterarValorParceria: function (event) {
        if (event.which == 13)
            event.preventDefault();

        var textBoxProprietario = $('#textBoxProprietario');
        var textBoxAUSA = $('#textBoxAUSA');
        var inputTyping = event.target && event.target.id == 'textBoxProprietario' ? textBoxProprietario : textBoxAUSA;
        var inputDiff = event.target && event.target.id == 'textBoxProprietario' ? textBoxAUSA : textBoxProprietario;
        var valor = gafisa.alphabook.home.dadosProjeto.obterValor(inputTyping.val());
        var valorDiferenca = Math.max(100 - valor, 0).toFixed(2).replace('.', ',');

        inputDiff.val(valorDiferenca);

        gafisa.alphabook.home.dadosProjeto.calcularVGVProprietario();
        gafisa.alphabook.home.dadosProjeto.aoAlterarVGV();
    },

    aoAlterarValorConsorcio: function (event) {
        if (event.which == 13)
            event.preventDefault();

        var textBoxSocio = $('#textBoxSocio');
        var textBoxAUSA = $('#textBoxConsorcioAUSA');
        var inputTyping = event.target && event.target.id == 'textBoxSocio' ? textBoxSocio : textBoxAUSA;
        var inputDiff = event.target && event.target.id == 'textBoxSocio' ? textBoxAUSA : textBoxSocio;
        var valor = gafisa.alphabook.home.dadosProjeto.obterValor(inputTyping.val());
        var valorDiferenca = Math.max(100 - valor, 0).toFixed(2).replace('.', ',');

        inputDiff.val(valorDiferenca);

        gafisa.alphabook.home.dadosProjeto.calcularVGVSocio();
    },

    aoAlterarValorTabela: function (coluna) {
        var linhas = $('#tabelaDadosFinanceiros tbody tr.linha-uso');
        var soma = 0;

        linhas.each(function () {
            var input = $(this).find('td:eq(' + coluna + ') input:text');

            soma += gafisa.alphabook.home.dadosProjeto.obterValor(input.val());
        });

        if (coluna == 4) {
            $('#tabelaDadosFinanceiros tbody tr:eq(3) td:eq(' + coluna + ')').html('');
        } else {
            $('#tabelaDadosFinanceiros tbody tr:eq(3) td:eq(' + coluna + ')').html($.formatCurrency('' + Math.roundDecimal(soma, 2)));
        }

        gafisa.alphabook.home.dadosProjeto.calcularVGVProprietarioSocio();
    },

    aoAlterarReceitaLucro: function () {
        gafisa.alphabook.home.dadosProjeto.preencherPorcentagem('#ComiteLucro', '#ComiteReceita', '#porcentagemGeracaoCaixaComite');
        gafisa.alphabook.home.dadosProjeto.preencherPorcentagem('#lucroTotal', '#receitaTotal', '#porcentagemGeracaoCaixa');

        $('#tabelaDadosFinanceiros tr.linha-uso').each(function () {
            gafisa.alphabook.home.dadosProjeto.preencherPorcentagem($(this).find('input:text[id^=Lucro_]'), $(this).find('input:text[id^=Receita_]'), $(this).find('[id^=porcentagemGeracaoCaixa_]'));
        });
    },

    aoAlterarVGVAUSA: function () {
        gafisa.alphabook.home.dadosProjeto.preencherTotal(['[name="ComiteVGVAUSAImediato"]', '[name="ComiteVGVAUSACurtoPrazo"]', '[name="ComiteVGVAUSAMedioPrazo"]', '[name="ComiteVGVAUSALongoPrazo"]'], '#totalVGVAUSAComite');

        //gafisa.alphabook.home.dadosProjeto.preencherTotal(['#VGVAUSAImediatoTotal', '#VGVAUSACurtoPrazoTotal', '#VGVAUSAMedioPrazoTotal', '#VGVAUSALongoPrazoTotal'], '#totalVGVAUSA');

        //$('#tabelaDadosFinanceiros tr.linha-uso').each(function () {
        //    gafisa.alphabook.home.dadosProjeto.preencherTotal($(this).find('.campo-vgv-ausa'), $(this).find('[id^=totalVGVAUSA_]'));
        //});

        //gafisa.alphabook.home.dadosProjeto.aoAlterarVGV();
    },

    aoAlterarVGV: function () {
        gafisa.alphabook.home.dadosProjeto.preencherTotal(['[name="ComiteVGVProprietario"]', '[name="ComiteVGVSocio"]', '#totalVGVAUSAComite'], '#totalVGVComite');

        $('#tabelaDadosFinanceiros tr.linha-uso').each(function () {
            var alv = gafisa.alphabook.home.dadosProjeto.obterValor($(this).find('input:text[id^=Alv_]').val());
            var estimativaPreco = gafisa.alphabook.home.dadosProjeto.obterValor($(this).find('input:text[id^=EstimativaPreco_]').val());
            var vgvParceiro = gafisa.alphabook.home.dadosProjeto.obterValor($(this).find('input:text[id^=VGVProprietario_]').val());
            var vgvSocio = gafisa.alphabook.home.dadosProjeto.obterValor($(this).find('input:text[id^=VGVSocio_]').val());

            gafisa.alphabook.home.dadosProjeto.preencherTotalVGVColumn(alv, estimativaPreco, vgvParceiro, vgvSocio, $(this).find('td[id^=totalVGV_]'));
        });

        gafisa.alphabook.home.dadosProjeto.calcularVGVAUSA();
    },

    calcularVGVProprietarioSocio: function () {
        gafisa.alphabook.home.dadosProjeto.calcularVGVProprietario();
        gafisa.alphabook.home.dadosProjeto.calcularVGVSocio();
        gafisa.alphabook.home.dadosProjeto.aoAlterarVGV();
    },

    calcularVGVProprietario: function () {
        gafisa.alphabook.home.dadosProjeto.calcularVGVProprietarioFormula($('#ComiteAlv'), $('#ComiteEstimativaPreco'), $('#textBoxProprietario'), $('#ComiteVGVProprietario'));

        var linhas = $('#tabelaDadosFinanceiros tbody tr.linha-uso');

        linhas.each(function () {
            gafisa.alphabook.home.dadosProjeto.calcularVGVProprietarioFormula($(this).find('[id^=Alv_]'), $(this).find('[id^=EstimativaPreco_]'), $('#textBoxProprietario'), $(this).find('[id^=VGVProprietario_]'));
        });
    },

    calcularVGVSocio: function () {
        gafisa.alphabook.home.dadosProjeto.calcularVGVSocioFormula($('#ComiteAlv'), $('#ComiteEstimativaPreco'), $('#ComiteVGVSocio'));

        var linhas = $('#tabelaDadosFinanceiros tbody tr.linha-uso');

        linhas.each(function () {
            gafisa.alphabook.home.dadosProjeto.calcularVGVSocioFormula($(this).find('[id^=Alv_]'), $(this).find('[id^=EstimativaPreco_]'), $(this).find('[id^=VGVSocio_]'));
        });
    },

    calcularVGVAUSA: function () {
        var linhas = $('#tabelaDadosFinanceiros tbody tr.linha-uso');

        linhas.each(function () {
            gafisa.alphabook.home.dadosProjeto.calcularVGVAUSAFormula($(this).find('[id^=Alv_]'), $(this).find('[id^=EstimativaPreco_]'), $(this).find('[id^=totalVGVAUSA_]'));
        });
    },

    calcularVGVProprietarioFormula: function (seletorAlvM2, seletorEstimativaPreco, seletorVgvProprietario, seletorCampoAlvo) {
        var alvM2 = gafisa.alphabook.home.dadosProjeto.obterValor(seletorAlvM2.val());
        var estimativaPreco = gafisa.alphabook.home.dadosProjeto.obterValor(seletorEstimativaPreco.val());
        var valProprietario = document.getElementById('textBoxProprietario').value;

        //Melhoria - Felipe Santos --  =ALV*(1-%AUSA  parceria)*Preço/m²)
        var valVGVProprietario = alvM2 * (valProprietario.replaceAll(',', '.') / 100) * estimativaPreco;

        seletorCampoAlvo.val($.formatCurrency(("" + valVGVProprietario)));

        //gafisa.alphabook.home.dadosProjeto.aoAlterarVGV();
    },

    calcularVGVSocioFormula: function (seletorAlvM2, seletorEstimativaPreco, seletorCampoAlvo) {
        var alvM2 = gafisa.alphabook.home.dadosProjeto.obterValor(seletorAlvM2.val());
        var estimativaPreco = gafisa.alphabook.home.dadosProjeto.obterValor(seletorEstimativaPreco.val());
        var vgvParceriaAusa = gafisa.alphabook.home.dadosProjeto.obterValor($('#textBoxAUSA').val());
        var vgvSocio = gafisa.alphabook.home.dadosProjeto.obterValor($('#textBoxSocio').val());

        //correção melhoria -- -- Felipe Santos =ALV*(1-%consórcioAUSA)*%AUSA*Preço/m²

        var ValVGVSocio = Math.roundDecimal((alvM2 * (vgvSocio / 100) * (vgvParceriaAusa / 100) * estimativaPreco), 2);

        seletorCampoAlvo.val($.formatCurrency(("" + ValVGVSocio)));
        //gafisa.alphabook.home.dadosProjeto.aoAlterarVGV();
    },

    calcularVGVAUSAFormula: function (seletorAlvM2, seletorEstimativaPreco, seletorCampoAlvo) {
        var alvM2 = gafisa.alphabook.home.dadosProjeto.obterValor(seletorAlvM2.val());
        var estimativaPreco = gafisa.alphabook.home.dadosProjeto.obterValor(seletorEstimativaPreco.val());
        var vgvParceriaAusa = gafisa.alphabook.home.dadosProjeto.obterValor($('#textBoxAUSA').val());
        var vgvConsorcioAusa = gafisa.alphabook.home.dadosProjeto.obterValor($('#textBoxConsorcioAUSA').val());

        var ValVGVAUSA = Math.roundDecimal((alvM2 * (vgvConsorcioAusa / 100) * (vgvParceriaAusa / 100) * estimativaPreco), 2);

        seletorCampoAlvo.html(($.formatCurrency(("" + Math.roundDecimal(ValVGVAUSA, 2)))));
    },

    preencherPorcentagem: function (seletorLucro, seletorReceita, seletorCampoResultado) {
        var lucro = gafisa.alphabook.home.dadosProjeto.obterValor($(seletorLucro).val() == "" ? $.trim($(seletorLucro).html()) : $(seletorLucro).val());
        var receita = gafisa.alphabook.home.dadosProjeto.obterValor($(seletorReceita).val() == "" ? $.trim($(seletorReceita).html()) : $(seletorReceita).val());

        var resultado = (lucro == 0 || receita == 0) ? 0 : (lucro / receita);

        $(seletorCampoResultado).html($.formatCurrency(("" + Math.roundDecimal(((resultado) * 100), 2))) + '%');
    },

    preencherTotalVGVColumn: function (alv, preco, vgvParceiro, vgvSocio, seletorCampoResultado) {
        var parceriaAusa = gafisa.alphabook.home.dadosProjeto.obterValor($('#textBoxAUSA').val());
        var consorcioAusa = gafisa.alphabook.home.dadosProjeto.obterValor($('#textBoxConsorcioAUSA').val());
        var vgvAusa = (alv * (parceriaAusa / 100) * (consorcioAusa / 100) * preco);
        var vgv = vgvAusa + vgvParceiro + vgvSocio;

        $(seletorCampoResultado).html($.formatCurrency(("" + Math.roundDecimal(vgv, 2))));

        var linhas = $('#tabelaDadosFinanceiros tr.linha-uso');

        gafisa.alphabook.home.dadosProjeto.preencherTotalVGV(linhas.find('[id^=totalVGV_]'), 'totalVGV');
        gafisa.alphabook.home.dadosProjeto.preencherTotalVGV(linhas.find('[id^=VGVProprietario_]'), 'totalVGVProprietario');
        gafisa.alphabook.home.dadosProjeto.preencherTotalVGV(linhas.find('[id^=VGVSocio_]'), 'totalVGVSocio');
        gafisa.alphabook.home.dadosProjeto.preencherTotalVGV(linhas.find('[id^=totalVGVAUSA_]'), 'totalVGVAUSA');
    },

    preencherTotal: function (seletores, seletorCampoResultado) {
        var soma = 0;

        $.each(seletores, function (index, elemento) {
            var val = $(elemento).val();

            soma += gafisa.alphabook.home.dadosProjeto.obterValor(val == "" ? $.trim($(elemento).html()) : val);
        });

        $(seletorCampoResultado).html($.formatCurrency(("" + Math.roundDecimal(soma, 2))));

        var linhas = $('#tabelaDadosFinanceiros tr.linha-uso');

        gafisa.alphabook.home.dadosProjeto.preencherTotalVGV(linhas.find('[id^=totalVGV_]'), 'totalVGV');
        gafisa.alphabook.home.dadosProjeto.preencherTotalVGV(linhas.find('[id^=VGVProprietario_]'), 'totalVGVProprietario');
        gafisa.alphabook.home.dadosProjeto.preencherTotalVGV(linhas.find('[id^=VGVSocio_]'), 'totalVGVSocio');
        gafisa.alphabook.home.dadosProjeto.preencherTotalVGV(linhas.find('[id^=totalVGVAUSA_]'), 'totalVGVAUSA');
    },

    preencherTotalVGV: function (seletores, seletorCampoResultado) {
        var soma = 0;

        $.each(seletores, function (index, elemento) {
            var val = $(elemento).val();

            soma += gafisa.alphabook.home.dadosProjeto.obterValor(val == "" ? $.trim($(elemento).html()) : val);
        });

        document.getElementById(seletorCampoResultado).innerHTML = ($.formatCurrency(("" + Math.roundDecimal(soma, 2))));
    },

    obterValor: function (val) {
        if (val == undefined)
            return 0;

        return parseFloat(+(val.replaceAll('.', '').replaceAll(',', '.')));
    },

    aoSalvarDadosFinanceiros: function () {
        if (!gafisa.alphabook.home.dadosProjeto.validarDadosFinanceiros()) return;

        var data = $('form.dadosFinanceiros').formToJSON();

        $.extend(data, gafisa.alphabook.home.dadosProjeto.tratarDadosFinanceiros($('tr.dadosFinanceiros, td.dadosFinanceiros').formToJSON()));

        data.Id = $('.header-dados-financeiros').data('id');
        data.IdProjeto = $('#tituloDadosProjeto').data('id');
        data.Usos = [];

        $('#tabelaDadosFinanceiros tr.linha-uso').each(function () {
            var item = gafisa.alphabook.home.dadosProjeto.tratarDadosFinanceiros($(this).formToJSON());

            item.Uso = { Id: item.Uso };

            data.Usos.push(item);
        });

        $.ajax({
            url: gafisa.alphabook.rotas.projeto.salvarDadosFinanceiros,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.dadosProjeto.aposSalvarDadosFinanceiros
        });
    },

    tratarDadosFinanceiros: function (data) {
        for (var prop in data) {
            data[prop] = data[prop].replaceAll('.', '');
        }

        return data;
    },

    aposSalvarDadosFinanceiros: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvosComSucesso.format('Dados financeiros'));
            $('.header-dados-financeiros').data('id', json.id);
        } else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);
    },

    validarDadosFinanceiros: function () {
        var valorProprietario = gafisa.alphabook.home.dadosProjeto.obterValor($('#textBoxProprietario').val());
        var valorProprietarioAUSA = gafisa.alphabook.home.dadosProjeto.obterValor($('#textBoxAUSA').val());
        var valorSocio = gafisa.alphabook.home.dadosProjeto.obterValor($('#textBoxSocio').val());
        var valorSocioAUSA = gafisa.alphabook.home.dadosProjeto.obterValor($('#textBoxConsorcioAUSA').val());
        var valorParceria = valorProprietario + valorProprietarioAUSA;
        var valorConsorcio = valorSocio + valorSocioAUSA;

        if (valorParceria != 100) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerIgual.format('Soma das porcentagens do proprietário e AUSA', '100%'));
            return false;
        }

        if (valorConsorcio != 100) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerIgual.format('Soma das porcentagens do sócio e AUSA', '100%'));
            return false;
        }

        var usos = $('#tabelaDadosFinanceiros tr.linha-uso select[id^=Uso_]').map(function () { return $(this).val(); }).toArray();

        if (usos.length != $.unique(usos).length) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.naoPodeSerDuplicado.format('Uso'));
            return false;
        }

        return true;
    },

    aoExportarDadosFinanceiros: function (e) {
        e.preventDefault();
        window.location.href = gafisa.alphabook.rotas.projeto.obterRelatorioDadosFinanceiros.concatQueryString({ idProjeto: $('#tituloDadosProjeto').data('id'), codigoProjeto: $('.linkCodigoProjeto').text() });
    },

    aoAdicionarUso: function () {
        var url = gafisa.alphabook.rotas.projeto.dadosFinanceirosUso;
        var data = {
            indice: $('tr.linha-uso').length,
            usosDesconsiderar: $('#tabelaDadosFinanceiros tr.linha-uso select[id^=Uso_]').map(function () { return $(this).val(); }).toArray().join(',')
        };

        $.get(url, data, function (html) {
            $('#tabelaDadosFinanceiros tr.linha-uso:last').after(html);

            if (gafisa.alphabook.home.dadosProjeto.ocultarColunas === true) {
                $('#tabelaDadosFinanceiros tr.linha-uso .negocios-ocultar').hide();
            }

            $.navegar.ajustarRodape();
        }, 'html');
    },

    // POLIGONO //
    aoEditarPoligono: function () {
        $.navegar.obterPoligono(gafisa.alphabook.home.carrossel.obterIdProjeto(), gafisa.alphabook.home.dadosProjeto.aoRetornarEdicaoPoligono, $("#areaPoligono").data('coordenadas'));
    },

    aoRetornarEdicaoPoligono: function (pontos, area) {
        var coordenadas = '';
        for (var i = 0; i < pontos.length; i++) {
            coordenadas += pontos[i].Latitude + '|';
            coordenadas += pontos[i].Longitude + '|';
            coordenadas += pontos[i].Ordem + ' ';
        }

        $("#areaPoligono").data('coordenadas', coordenadas);
        $("#areaPoligono").text(area);
    },

    // Centro de Custo //
    aoExibirCentroCusto: function () {
        gafisa.alphabook.home.dadosProjeto.listarCentroCusto();
    },

    listarCentroCusto: function () {
        $('#tabelaCentroCusto').tabela({
            action: gafisa.alphabook.rotas.projeto.listarCentroCusto,
            parametros: { projetoId: $('#tituloDadosProjeto').data('id') },
            //tamanhoPagina: 5,
            callback: $.navegar.ajustarRodape
        });
    },

    aoAdicionarCentroCusto: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.projeto.adicionarCentroCusto);
    },

    aoEditarCentroCusto: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.projeto.adicionarCentroCusto, { id: $(this).data('id') });
    },

    aoSalvarCentroCusto: function () {
        if (!gafisa.alphabook.home.dadosProjeto.validarCentroCusto()) return;

        var data = $('#formCentroCusto').formToJSON();

        data.projetoId = $('#tituloDadosProjeto').data('id');

        $.ajax({
            url: gafisa.alphabook.rotas.projeto.salvarCentroCusto,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.dadosProjeto.aposSalvarCentroCusto
        });
    },

    validarCentroCusto: function () {
        if (String.isNullOrEmpty($('#Codigo').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('Centro de Custo'));
            return false;
        }

        if (String.isNullOrEmpty($('#Ordem').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchida.format('Ordem'));
            return false;
        }

        if (!String.isNullOrEmpty($('#DataCriacao').val()) && !gafisa.alphabook.validar.data($('#DataCriacao').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerValida.format('Data de Criação'));
            return false;
        }

        if (String.isNullOrEmpty($('#Ativo').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('Status'));
            return false;
        }

        if (String.isNullOrEmpty($('#CodigoEmpresa').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('Código da Empresa'));
            return false;
        }

        if (String.isNullOrEmpty($('#RazaoSocial').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchida.format('Razão Social'));
            return false;
        }

        if (String.isNullOrEmpty($('#CNPJ').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('CNPJ'));
            return false;
        }

        if (!gafisa.alphabook.validar.cnpj($('#CNPJ').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerValido.format('CNPJ'));
            return false;
        }

        return true;
    },

    aposSalvarCentroCusto: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Centro de Custo'));
            gafisa.alphabook.home.dadosProjeto.listarCentroCusto();
            $.dialogo.fechar();
        } else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);

        $('.seg-footer').css('top', '790px');
    },
};

$(document).ready(gafisa.alphabook.home.dadosProjeto.inicializar);
