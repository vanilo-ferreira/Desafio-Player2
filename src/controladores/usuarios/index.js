const knex = require('../../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const {
        nome,
        email,
        senha,
    } = req.body;

    const { nomeRestaurante,
        descricao,
        idCategoria,
        taxaEntrega,
        tempoEntregaEmMinutos,
        valorMinimoPedido } = req.body.restaurante;

    if (!nome) {
        return res.status(404).json("O campo nome é obrigatório");
    }

    if (!email) {
        return res.status(404).json("O campo email é obrigatório");
    }

    if (!senha) {
        return res.status(404).json("O campo senha é obrigatório");
    }

    if (!nomeRestaurante) {
        return res.status(404).json("O campo nome do restaurante é obrigatório");
    }

    if (!idCategoria) {
        return res.status(404).json("O campo categoria é obrigatório");
    }

    if (!taxaEntrega) {
        return res.status(404).json("O campo nome é obrigatório");
    }

    if (!tempoEntregaEmMinutos) {
        return res.status(404).json("O campo tempo de entrega é obrigatório");
    }

    if (!valorMinimoPedido) {
        return res.status(404).json("O campo valor minimo do pedido é obrigatório");
    }

    try {

        const usuarioExiste = await knex('usuario').select('*').where({ email }).first();

        if (usuarioExiste) {
            return res.status(400).json("O e-mail informado já existe");
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const cadastrandoUsuario = await knex('usuario')
            .insert({
                nome,
                email,
                senha: senhaCriptografada
            });

        if (!cadastrandoUsuario) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        const buscaId = await knex('usuario').select('id').where({ email }).first();

        const cadastrandoRestaurante = await knex('restaurante')
            .insert({
                usuario_id: buscaId.id,
                nome: nomeRestaurante,
                descricao,
                categoria_id: idCategoria,
                taxa_entrega: taxaEntrega,
                tempo_entrega_minutos: tempoEntregaEmMinutos,
                valor_minimo_pedido: valorMinimoPedido
            });

        if (!cadastrandoRestaurante) {
            await knex('usuario').where({ id: buscaId.id }).del();
            return res.status(400).json("Não foi possível concluir o seu cadastro");
        }

        return res.status(200).json("Cadastro realizado com sucesso!");

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterCategorias = async (req, res) => {
    try {
        const listaDeCategorias = await knex('categoria').select('*');
        return res.status(200).json(listaDeCategorias);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const obterDadosHeader = async (req, res) => {
    const { id } = req.usuario;

    try {
        const dadosRestaurante = await knex('restaurante')
            .where('usuario_id', id);

        const { categoria_id } = dadosRestaurante[0];

        const obterCategoria = await knex('categoria').where('id', categoria_id);

        const objetoNomeWallpaper = {
            nomeRestaurante: dadosRestaurante[0].nome,
            categoriaWallpaper: obterCategoria[0].imagem_categoria,
            imagemPerfil: dadosRestaurante[0].imagem_restaurante
        }

        return res.status(200).json(objetoNomeWallpaper);

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    obterCategorias,
    obterDadosHeader
}