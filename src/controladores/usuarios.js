const knex = require('../bd');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req,res)  => {
    const {username,senha} = req.body;

    if(!username){
        return res.status(400).json({mensagem: "O campo username é obrigatório"});
    }

    if(!senha){
        return res.status(400).json({mensagem: "O campo senha é obrigatório"});
    }
    if(senha.length < 5){
        return res.status(404).json({mensagem: "A senha deve ter no mínimo 5 caracteres"});
    }

     try{
        const quantidadeUsuarios = await knex('usuarios').where({username}).first();
        if(quantidadeUsuarios){
            return res.status(400).json({mensagem: "Já existe um usuário com esse username"});
        }

        const senhaCriptografada = await bcrypt.hash(senha,10);

        const usuario = await knex('usuarios').insert({username,senha: senhaCriptografada});
        if(!usuario){
            return res.status(400).json({mensagem: "Não foi possível cadastrar o usuário"});
        }

        return res.status(200).json({mensagem: "Usuário cadastrado com sucesso"});
     } catch (error) {
        return res.status(400).json(error.message);
     }
}
module.exports = {
    cadastrarUsuario
}
