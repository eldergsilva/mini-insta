const knex = require('../bd');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { username, senha } = req.body;

    if (!username) {
        return res.status(400).json({ mensagem: "O campo username é obrigatório" });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "O campo senha é obrigatório" });
    }
    if (senha.length < 5) {
        return res.status(400).json({ mensagem: "A senha deve ter no mínimo 5 caracteres" });
    }

    try {
        const usuarioExiste = await knex('usuarios').where({ username }).first();
        if (usuarioExiste) {
            return res.status(400).json({ mensagem: "Já existe um usuário com esse username" });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuarios').insert({ username, senha: senhaCriptografada });
        if (!usuario) {
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o usuário" });
        }

        return res.status(200).json({ mensagem: "Usuário cadastrado com sucesso" });
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
}

const atualizarPerfil = async (req, res) => {
    let {
        nome,
        email,
        senha,
        imagem,
        username,
        site,
        bio,
        telefone,
        genero
    } = req.body;

    const { id } = req.usuario;

    if (!nome && !email && !senha && !imagem && !username && !site && !bio && !telefone && !genero) {
        return res.status(400).json({ mensagem: "É necessário informar ao menos um campo para atualização" });
    }

    try {
        const dadosParaAtualizar = {};

        if (senha) {
            if (senha.length < 5) {
                return res.status(400).json({ mensagem: "A senha deve ter no mínimo 5 caracteres" });
            }
            dadosParaAtualizar.senha = await bcrypt.hash(senha, 10);
        }

        if (email && email !== req.usuario.email) {
            const emailUsuarioExiste = await knex('usuarios').where({ email }).first();
            if (emailUsuarioExiste) {
                return res.status(400).json({ mensagem: "Já existe um usuário com esse email" });
            }
            dadosParaAtualizar.email = email;
        }

        if (username && username !== req.usuario.username) {
            const usernameUsuarioExiste = await knex('usuarios').where({ username }).first();
            if (usernameUsuarioExiste) {
                return res.status(400).json({ mensagem: "Já existe um usuário com esse username" });
            }
            dadosParaAtualizar.username = username;
        }

        if (nome) dadosParaAtualizar.nome = nome;
        if (imagem) dadosParaAtualizar.imagem = imagem;
        if (site) dadosParaAtualizar.site = site;
        if (bio) dadosParaAtualizar.bio = bio;
        if (telefone) dadosParaAtualizar.telefone = telefone;
        if (genero) dadosParaAtualizar.genero = genero;

        const usuarioAtualizado = await knex('usuarios').where({ id }).update(dadosParaAtualizar);

        if (!usuarioAtualizado) {
            return res.status(400).json({ mensagem: "Não foi possível atualizar o perfil" });
        }

        return res.status(200).json({ mensagem: "Perfil atualizado com sucesso" });

    } catch (error) {
        return res.status(400).json({ mensagem: "Erro ao atualizar perfil" });
    }
}

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
}