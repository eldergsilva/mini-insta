const express = require("express");


const rotas = express();


rotas.post('/cadastro',usuarios.cadastrarUsuario);
rotas.post('/login',login.login);

rotas.use(verifcaLogin);

rotas.get('perfil',usuarios.perfilUsuario);
rotas.put('perfil',usuarios.atualizarUsuario);

