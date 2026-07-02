const express = require("express");
const {cadastrarUsuario, obterPerfil} = require('./controladores/usuarios');


const rotas = express();

rotas.post('/cadastro',usuarios.cadastrarUsuario);
rotas.post('/login',login.login);

rotas.use(verifcaLogin);

rotas.get('perfil',usuarios.obterPerfil);
rotas.put('perfil',usuarios.atualizarUsuario);
module.exports = rotas;

