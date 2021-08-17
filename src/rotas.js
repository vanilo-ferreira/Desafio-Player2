const express = require('express');
const usuarios = require('./controladores/usuarios/index');
const empresas = require('./controladores/empresas/index');
const login = require('./controladores/login/index');
const verificarLogin = require('./filtros/verificaLogin/index');

const rotas = express();

rotas.post('/empresas', empresas.cadastrarEmpresa);

// cadastro de usuario
rotas.post('/usuarios', usuarios.cadastrarUsuario);
rotas.get('/categorias', usuarios.obterCategorias);

//login
rotas.post('/login', login.logarUsuario);

//Filtro de login
//rotas.use(verificarLogin.verificarLogin);


module.exports = rotas;