if (typeof gafisa.alphabook.admin.categoriaContato == 'undefined') { gafisa.alphabook.admin.categoriaContato = new Object(); }

gafisa.alphabook.admin.categoriaContato.editar = {
    registrarAcoes: function () {
        $('#salvar').on('click', gafisa.alphabook.admin.categoriaContato.editar.aoSalvar);
        $("#categoriaPai").livequery('click', gafisa.alphabook.admin.categoriaContato.editar.aoAbrirCategoriasFormulario);
        $("#categoriasLista").livequery('click', gafisa.alphabook.admin.categoriaContato.editar.aoAbrirCategorias);
        gafisa.alphabook.admin.categoriaContato.editar.configurarJstreeFormulario();
    },

    configurarJstreeFormulario: function () {
        $("#categoriasLista").jstree({
            "themes": {
                "theme": "default",
                "dots": true,
                "icons": false
            },
            "plugins": ["themes", "html_data"]
        });

        $("#categoriasLista .itemCategoria").livequery('click', gafisa.alphabook.admin.categoriaContato.editar.aoSelecionarCategoria);
    },

    aoSelecionarCategoria: function () {
        var data = { categoriaId: $(this).data('categoriaid') };
        
        if (data.categoriaId == 0) {
            data.idCategoria = null;
            data.nomeCategoria = "Selecione";
            gafisa.alphabook.admin.categoriaContato.editar.aposSelecionarCategoriaId(data);
            return;
        }
        $.get(gafisa.alphabook.rotas.contatos.obterCategoria, data, gafisa.alphabook.admin.categoriaContato.editar.aposSelecionarCategoriaId, 'json');
    },

    aposSelecionarCategoriaId: function (json) {
        var sel = $("#categoriaPai");

        sel.empty();
        sel.append('<option value="">Selecione</option>');
        sel.append('<option selected="selected" value="' + json.idCategoria + '" >' + json.nomeCategoria + '</option>');

        $('#categoriasLista').toggle();
    },
    
    aoAbrirCategoriasFormulario: function () {
        $(this).blur();
        $('#categoriasLista').toggle();
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

    validar : function () {
        if (String.isNullOrEmpty($('#nome').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('Nome'));
            return false;
        }
        
        var  data = $('#form').formToJSON();
        
        if(data.Id != undefined && data.IdPai == data.Id) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.naoPodeSerIgual.format('Categoria', 'Categoria Pai'));
            return false;
        }

        return true;
    },

    aoSalvar: function () {
        
        if(!gafisa.alphabook.admin.categoriaContato.editar.validar()) return;
        
        var existemItensAssociados = false;

        if(!String.isNullOrEmpty($(this).data('id'))) {
            $.ajax({
                dataType: "json",
                url: gafisa.alphabook.rotas.admin.existemItensAssociadosCategoria,
                data: { id: $(this).data('id') },
                success: function(data) { existemItensAssociados = data.existemItensAssociados; },
                async: false,
            });

            if(existemItensAssociados) {
                $.dialogo.confirmar(gafisa.mensagens.categoriacontato.existemItensAssociadosAEstaCategoriaDesejaRealmenteAlterar, gafisa.alphabook.admin.categoriaContato.editar.salvar);
            }
        }
        
        if(!existemItensAssociados)
            gafisa.alphabook.admin.categoriaContato.editar.salvar();
    },

    salvar: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.salvarCategoriaContato;
        var parametros = $('#form').formToJSON();
        $.post(url, parametros, gafisa.alphabook.admin.categoriaContato.editar.aposSalvar, 'json');
    },

    aposSalvar: function (json) {
        if (json.sucesso) {
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Categoria Contato'), function() {
                history.back(); //window.location.href = gafisa.alphabook.rotas.admin.editarCategoriaContato+'/'+json.id;
            });
        } else {
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);
            $.loading({ action: 'hide' });
        }
    }
};

$(document).ready(gafisa.alphabook.admin.categoriaContato.editar.registrarAcoes);
