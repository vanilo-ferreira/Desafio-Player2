const knex = require('../../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const {
        nome,
        email,
        senha,
    } = req.body;

    if (!nome) {
        return res.status(404).json("O campo nome é obrigatório");
    }

    if (!email) {
        return res.status(404).json("O campo email é obrigatório");
    }
    
    if (!senha) {
        return res.status(404).json("O campo senha é obrigatório");
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

        return res.status(200).json("Cadastro realizado com sucesso!");

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario
}