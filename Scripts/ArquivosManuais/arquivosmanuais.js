if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.arquivosManuais = {
    botaoExcluir: null,
    idtaxonomia: null,
    uploader: {},
    temArquivo: false,
    inicializada: false,
    

    inicializar: function () {
        gafisa.alphabook.home.arquivosManuais.registrarAcoes();
   
        gafisa.alphabook.home.arquivosManuais.filtrar();
    },

    registrarAcoes: function () {
        $('#arquivosmanuais').livequery('click', gafisa.alphabook.home.arquivosManuais.aoClicarTile);
        $('#buscarArquivos', '#controleArquivosManuais').livequery('click', gafisa.alphabook.home.arquivosManuais.aoBuscarArquivos);
        //$('.tile-docArquivosManuais', '#controleArquivosManuais').livequery('click', gafisa.alphabook.home.arquivosManuais.aoClicarTileDocumento);
        $('.btnBaixarArquivosManuais', '#controleArquivosManuais').livequery('click', gafisa.alphabook.home.arquivosManuais.aoBaixarArquivo);
        $('#controleArquivosManuais .btnFiltroArquivosManuais').livequery('click', gafisa.alphabook.home.arquivosManuais.buscarArquivos);
        $('#controleArquivosManuais #statusProjeto').livequery('change', gafisa.alphabook.home.arquivosManuais.buscarArquivos);
        $('#controleArquivosManuais .btnInserirArquivo').livequery('click', gafisa.alphabook.home.arquivosManuais.inserirArquivos);
        $('#controleArquivosManuais .close-button-ArquivosManuais').livequery('click', gafisa.alphabook.home.arquivosManuais.closeModal);
        $('#controleArquivosManuais').livequery(gafisa.alphabook.home.arquivosManuais.inicializarTela);
    },

 

    inicializarTela: function () {
        if (!gafisa.alphabook.home.arquivosManuais.inicializada) {
        
            //gafisa.alphabook.home.arquivosManuais.filtrar();
            gafisa.alphabook.home.arquivosManuais.buscarArquivos();

        }
    },

    filtrar: function () {

        let id = $('#statusProjeto').val();

        $('#tabelaRelatorioArquivosManuais').tabelaHeader({
            action: gafisa.alphabook.rotas.arquivosManuais.listarDadosArquivosManuais, parametros: { Id: id}, callback: function () {
         
                    $('#tabelaRelatorioArquivosManuais .negocios-ocultar, #tabelaRelatorioArquivosManuaisH .negocios-ocultar').hide();
                    $('#tabelaRelatorioArquivosManuais .negocios-colspan, #tabelaRelatorioArquivosManuaisH .negocios-colspan').attr('colspan', 1);
             
            }
        });
    },


    inserirArquivos: function (file,date) {
        //var fileInput = document.getElementById('uploadExcel');
        //var file = fileInput.files[0];
        let id = $('#statusProjeto').val(); // Captura o valor do ID

        // Seleciona o overlay
        var overlay = document.getElementById('overlay');

        if (file) {
            var formData = new FormData();
            formData.append("arquivoCsv", file);
            formData.append("id", id); // Adiciona o ID ao FormData
            formData.append("idStatus", 0); // Adiciona o ID ao FormData
            formData.append("date", date); // Adiciona o ID ao FormData

            // Mostrar o overlay de espera
            overlay.style.display = 'flex';

            fetch(gafisa.alphabook.rotas.arquivosManuais.processarArquivoCsv, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    // Esconder o overlay de espera
                    overlay.style.display = 'none';

                    if (data.sucesso) {
                        gafisa.alphabook.home.arquivosManuais.showModal(true, "Arquivo processado com sucesso!");
                        gafisa.alphabook.home.arquivosManuais.buscarArquivos();
                    } else {
                        gafisa.alphabook.home.arquivosManuais.showModal(false, data.mensagem);
                    }
                })
                .catch(error => {
                    // Esconder o overlay de espera
                    overlay.style.display = 'none';

                    console.error('Erro:', error);
                    gafisa.alphabook.home.arquivosManuais.showModal(false, "Ocorreu um erro ao processar o arquivo.");
                });
        } else {
            gafisa.alphabook.home.arquivosManuais.showModal(false, "Por favor, selecione um arquivo.");
        }
    },


    extrairMesAno: function (data) {
    const [dia, mes, ano] = data.split('/').map(Number);
    return { mes, ano };
    },

    mostrarModalConfirmacao: function(id) {
    itemParaExcluir = id; // Armazena o id do item a ser excluído
        $('#modalConfirmacaoArquivos').modal('show');


        $('#confirmarExclusao').click(function () {
            if (itemParaExcluir !== null) {
                gafisa.alphabook.home.arquivosManuais.excluirItem(itemParaExcluir);
            }
            $('#modalConfirmacaoArquivos').modal('hide');
        });
    },

    mostrarModalEdicao: function (id, DataAlteracao, nomeArquivos, Status) {
        itemParaEditar = id; // Armazena o id do item a ser excluído
        const dataISO = gafisa.alphabook.home.arquivosManuais.formatDateToISO(DataAlteracao);
        

            $('#modalConfirmacaoArquivosEdicao').modal('show');

            document.getElementById('dataFiltroCargaEdicao').value = dataISO

            $('#confirmarEdicao').click(function () {

                var fileInput = document.getElementById('uploadExcelEdicao');
                var file = fileInput.files[0];
                var textoSelecionado = $('#statusProjeto option:selected').text();

                if (file) {

                    if (file.name == textoSelecionado) {

                        if (itemParaEditar !== 0) {
                            gafisa.alphabook.home.arquivosManuais.editarItem(itemParaEditar, file);
                        }
                        else {
                            gafisa.alphabook.home.arquivosManuais.inserirArquivos(file, dataISO);
                        }
                        $('#modalConfirmacaoArquivosEdicao').modal('hide');

                    }
                    else {
                        gafisa.alphabook.home.arquivosManuais.showModal(false, "Arquivo para substituir não corresponde ao selecionado.");
                    }
                   

                }
                else {
                    gafisa.alphabook.home.arquivosManuais.showModal(false, "Por favor, selecione um arquivo.");
                }
            });

        
        //else {
        //    gafisa.alphabook.home.arquivosManuais.showModal(false, "Arquivo selecionado não contem anexo.");
        //}
    },

    formatDateToISO: function(dateStr) {
    // Supondo que o formato da data seja dd/MM/yyyy
    const [day, month, year] = dateStr.split('/');
    // Retorna o formato yyyy-MM-dd
    return `${year}-${month}-${day}`;
    },


    buscarArquivos: function () {

        let id = $('#statusProjeto').val();
        var dataValorFiltro = $('#dataFiltroCarga').val();

        $.ajax({
            url: gafisa.alphabook.rotas.arquivosManuais.listarDadosArquivosManuais, // Altere "Controller" para o nome do seu controlador
            type: 'GET',
            data: { Id: id, Data: dataValorFiltro },
            dataType: 'json',
            success: function (response) {
                var tabela = $('#tabelaRelatorioArquivosManuais tbody');
                tabela.empty(); // Limpa o conteúdo anterior

                $.each(response, function (index, item) {

                    let Data = gafisa.alphabook.home.arquivosManuais.parseJsonDateH(item.DataInsercao);
                    let Status = gafisa.alphabook.home.arquivosManuais.getStatusClass(item.Status);
                    

                    
                    var linha = '<tr>' +
                        '<td>' + item.ID + '</td>' +  // ID do item
                        '<td>' + item.NomeArquivo + '</td>' + // Nome do arquivo
                        '<td>' + item.NomeUsuario + '</td>' + // Nome do usuário
                        '<td>' + item.MesInsercao + '</td>' +  // Mês de inserção
                        '<td>' + Data + '</td>' + // Data de carga
                        '<td><span class="status-circle ' + Status + '" data-status="' + item.Status + '"></span></td>' + // Adiciona data-status
                        '<td style="width:11%">' +
                        '<button class="btn-edit" data-id="' + item.ID + '" data-data="' + item.DataInsercao + '" data-arquivo="' + item.NomeArquivo + '" title="Editar">' +
                        '<i class="fas fa-edit"></i>' +
                        '</button>' +
                        '<button class="btn-delete" data-id="' + item.ID + '" title="Excluir">' +
                        '<i class="fas fa-trash-alt"></i>' +
                        '</button>' +
                        '</td>' +
                        '</tr>';
                    tabela.append(linha);
                    
                });

                // Configura o evento de clique para os botões de edição
                $('.btn-edit').off('click').on('click', function () {
                    var id = $(this).data('id');
                    var dataInsercao = gafisa.alphabook.home.arquivosManuais.parseJsonDate($(this).data('data'));
                    var nomeArquivo = $(this).data('arquivo');
                    var status = $(this).data('status'); // Obtém o status do botão

                    // Chame a função que você deseja com o ID, DataInsercao, nomeArquivo e status
                    gafisa.alphabook.home.arquivosManuais.mostrarModalEdicao(id, dataInsercao, nomeArquivo, status);
                });

                // Configura o evento de clique para os botões de exclusão
                $('.btn-delete').off('click').on('click', function () {
                    var id = $(this).data('id');
                    // Chame a função que você deseja com o ID
                    gafisa.alphabook.home.arquivosManuais.mostrarModalConfirmacao(id);
                });
            },
            error: function (xhr, status, error) {
                console.error('Erro na solicitação AJAX:', status, error);
            }
        });
    },


    excluirItem:  function(id) {

        let idStatus = $('#statusProjeto').val();



        $.ajax({
            url: gafisa.alphabook.rotas.arquivosManuais.excluirArquivos,
            type: 'POST', // ou 'GET' se for o caso
            data: { id: id, idStatus: idStatus },
            dataType: 'json',
            success: function (response) {
                if (response.sucesso) {
                    gafisa.alphabook.home.arquivosManuais.showModal(true, response.mensagem);
                    gafisa.alphabook.home.arquivosManuais.buscarArquivos();
                    mostrarModalDeEdicao(response);
                }
                else {
                    gafisa.alphabook.home.arquivosManuais.showModal(false, response.mensagem);
                }
            },
            error: function (xhr, status, error) {
                gafisa.alphabook.home.arquivosManuais.showModal(false, response.mensagem);
            }
        });
    },

    editarItem: function (id, file) {

        let idStatus = $('#statusProjeto').val();

        var formData = new FormData();
        formData.append("arquivoCsv", file);
        formData.append("id", id); // Adiciona o ID ao FormData
        formData.append("idStatus", idStatus); // Adiciona o ID ao FormData
        var overlay = document.getElementById('overlay');

        // Mostrar o overlay de espera
        overlay.style.display = 'flex';

        fetch(gafisa.alphabook.rotas.arquivosManuais.editarArquivos, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                // Esconder o overlay de espera
                overlay.style.display = 'none';

                if (data.sucesso) {
                    gafisa.alphabook.home.arquivosManuais.showModal(true, "Arquivo processado com sucesso!");
                    gafisa.alphabook.home.arquivosManuais.buscarArquivos();
                } else {
                    gafisa.alphabook.home.arquivosManuais.showModal(false, data.mensagem);
                }
            })
            .catch(error => {
                // Esconder o overlay de espera
                overlay.style.display = 'none';

                console.error('Erro:', error);
                gafisa.alphabook.home.arquivosManuais.showModal(false, "Ocorreu um erro ao processar o arquivo.");
            });

    },

    parseJsonDate: function (jsonDate) {
    // Extrair timestamp em milissegundos
    var timestamp = parseInt(jsonDate.replace(/\/Date\((\d+)\)\/$/, '$1'), 10);
    var date = new Date(timestamp);
    return date.toLocaleDateString(); // Formato de data padrão do navegador
    },

    parseJsonDateH: function (jsonDate) {
        // Extrair timestamp em milissegundos
        var timestamp = parseInt(jsonDate.replace(/\/Date\((\d+)\)\/$/, '$1'), 10);
        var date = new Date(timestamp);

        // Formatar a data e hora
        var options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Para formato 24 horas
        };

        return date.toLocaleString(undefined, options); // Formato de data e hora
    },

    getStatusClass: function(status) {
    return status ? "status-active" : "status-inactive";
    },

    aoBuscarArquivos: function () {
        $.navegar.proximo(gafisa.alphabook.rotas.arquivosManuais.index, { Termo: $('#termo').val(), IdsTemaplates: $('body').data('ids') });
    },

    aoBaixarArquivo: function (e) {
        e.preventDefault();

        let id = $('#statusProjeto').val();

        window.location.href = gafisa.alphabook.rotas.arquivosManuais.download.concatQueryString({  id: id });
    },

    showModal: function(isSuccess, message) {
    var modal = document.getElementById("modal-ArquivosManuais");
    var modalMessage = document.getElementById("modal-message");
    var modalContent = modal.querySelector(".modal-content-ArquivosManuais");

    if (isSuccess) {
        modalContent.classList.add("success");
        modalContent.classList.remove("error");
    } else {
        modalContent.classList.add("error");
        modalContent.classList.remove("success");
    }

    modalMessage.textContent = message;
    modal.style.display = "block";
},

    closeModal: function() {
    var modal = document.getElementById("modal-ArquivosManuais");
    modal.style.display = "none";
    },

    aoClicarTile: function () {
        if (!$(this).hasClass('inativo')) {
            if ($('body').data('ids'))
                $('body').removeData('ids');

            $.navegar.proximo(gafisa.alphabook.rotas.arquivosManuais.index, null, function () { $('body').data('hashPai', window.location.hash); });
        }
    },

    erro: function (up, erro) {
        var listaErros = [];

        if (erro.code == plupload.FILE_SIZE_ERROR)
            listaErros.push(gafisa.mensagens.upload.tamanhoMaximoExcedido.format(50));

        if (listaErros.length > 0) {
            gafisa.alphabook.mensagens.exibirMensagemErro(listaErros);
        }
    },


};

$(document).ready(gafisa.alphabook.home.arquivosManuais.inicializar);