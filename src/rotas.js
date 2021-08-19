const express = require('express');
const usuarios = require('./controladores/usuarios/index');
const empresas = require('./controladores/empresas/index');
const login = require('./controladores/login/index');
const verificarLogin = require('./filtros/verificaLogin/index');

const rotas = express();

// cadastro de usuario
rotas.post('/cadastrarUsuario', usuarios.cadastrarUsuario);

//login
rotas.post('/login', login.logarUsuario);

//Filtro de login
rotas.use(verificarLogin.verificarLogin);

//Empresas
rotas.post('/empresas', empresas.cadastrarEmpresa);
rotas.get('/empresas', empresas.listarTodasEmpresas);
rotas.get('/minhasEmpresas', empresas.obterMinhasEmpresas);
rotas.post('/minhasEmpresas/:id', empresas.atualizarEmpresa);
rotas.delete('/excluirEmpresa/:id', empresas.excluirEmpresa);

module.exports = rotas;