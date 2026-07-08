const express = require("express");
const { cadastrarUsuario, obterPerfil, atualizarPerfil } = require('./controladores/usuarios');
const {  novaPostagem,curtir} = require('./controladores/postagens');
const verificaLogin = require('./filtros/verificaLogin'); 
const login = require('./controladores/login');

const rotas = express();

rotas.post('/cadastro', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(verificaLogin);


rotas.get('/perfil', obterPerfil);
rotas.put('/perfil', atualizarPerfil);
rotas.post('/postagens', novaPostagem);
rotas.post('/postagens/:postagemId/curtir',curtir);

module.exports = rotas;