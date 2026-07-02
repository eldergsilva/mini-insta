const express = require("express");
const { cadastrarUsuario, obterPerfil, atualizarPerfil } = require('./controladores/usuarios');
 

const rotas = express();

rotas.post('/cadastro', cadastrarUsuario);
 
 

rotas.get('/perfil', obterPerfil);
rotas.put('/perfil', atualizarPerfil);

module.exports = rotas;