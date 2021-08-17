const knex= require('../../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaHash = require('../../segredo_token');

const logarUsuario = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(404).json('E-mail e senha são obrigatórios');
    }

    try {
        const objUsuario = await knex('usuario').where({email: email});
        const usuario = objUsuario[0];

        if (!usuario) {
            return res.status(400).json("O usuario não foi encontrado");
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(400).json("Email e senha não conferem.");
        }

        const token = jwt.sign({ id: usuario.id }, senhaHash);
        delete usuario.senha;
        const dadosUsuario = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    logarUsuario
}