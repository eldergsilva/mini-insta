const knex = require('../bd');

const novaPostagem = async (req, res) => {
    const { id } = req.usuario;
    const { texto, fotos } = req.body;

    if (!fotos || fotos.length === 0) {
        return res.status(400).json({ mensagem: 'É necessário enviar ao menos uma foto' });
    }

    try {
        const postagem = await knex('postagem').insert({
            usuario_id: id,
            texto
        }).returning('*');

        if (!postagem) {
            return res.status(400).json({ mensagem: 'Não foi possível concluir a postagem' });
        }

        for (const foto of fotos) {
            foto.postagem_id = postagem[0].id;
        }

        const fotosCadastradas = await knex('postagem_foto').insert(fotos).returning('*');

        if (!fotosCadastradas) {
            await knex('postagem').where({ id: postagem[0].id }).del();
            return res.status(400).json({ mensagem: 'Não foi possível cadastrar as fotos da postagem' });
        }

        return res.status(200).json({ mensagem: 'Postagem criada com sucesso' });

    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

const curtir = async (req, res) => {
    const { id } = req.usuario;
    const { postagemId } = req.params;

    try {
        const postagem = await knex('postagem').where({ id: postagemId }).first();
        if (!postagem) {
            return res.status(404).json({ mensagem: 'Postagem não encontrada' });
        }

        const jaCurtiu = await knex('postagem_curtidas').where({ usuario_id: id, postagem_id: postagemId }).first();
        if (jaCurtiu) {
            return res.status(400).json({ mensagem: 'Você já curtiu essa postagem' });
        }

        const curtida = await knex('postagem_curtidas').insert({ usuario_id: id, postagem_id: postagemId }).returning('*');

        if (!curtida) {
            return res.status(400).json({ mensagem: 'Não foi possível curtir a postagem' });
        }

        return res.status(200).json({ mensagem: 'Postagem curtida com sucesso' });
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

const comentar = async (req, res) => {
    const { id } = req.usuario;
    const { postagemId } = req.params;
    const { texto } = req.body;

    if (!texto) {
        return res.status(400).json({ mensagem: 'Para comentar nessa postagem é necessário informar o texto' });
    }

    try {
        const postagem = await knex('postagem').where({ id: postagemId }).first();
        if (!postagem) {
            return res.status(404).json({ mensagem: 'Postagem não encontrada' });
        }

        const comentario = await knex('postagem_comentarios').insert({
            usuario_id: id,
            postagem_id: postagemId,
            texto: texto
        }).returning('*');

        if (!comentario) {
            return res.status(400).json({ mensagem: 'Não foi possível comentar a postagem' });
        }

        return res.status(200).json({ mensagem: 'Postagem comentada com sucesso' });
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

const feed = async (req, res) => {
    const { id } = req.usuario;
    const { offset } = req.query;
    const o = offset ? parseInt(offset) : 0;

    try {
        const postagens = await knex('postagem').where('usuario_id', '!=', id).limit(10).offset(o);

        if (postagens.length === 0) {
            return res.status(200).json(postagens);
        }

        for (const postagem of postagens) {
            const usuario = await knex('usuarios')
                .where({ id: postagem.usuario_id })
                .select('imagem', 'username', 'verificado').first();
            postagem.usuario = usuario;

            const fotos = await knex('postagem_foto')
                .where({ postagem_id: postagem.id })
                .select('imagem');
            postagem.fotos = fotos;

            const curtidas = await knex('postagem_curtidas')
                .where({ postagem_id: postagem.id })
                .select('usuario_id');
            postagem.curtidas = curtidas.length;

            postagem.curtidoPorMim = curtidas.find(curtida => curtida.usuario_id === id) ? true : false;

            const comentarios = await knex('postagem_comentarios')
                .leftJoin('usuarios', 'usuarios.id', 'postagem_comentarios.usuario_id')
                .where({ postagem_id: postagem.id })
                .select('usuarios.username', 'postagem_comentarios.texto');
            postagem.comentarios = comentarios;
        }

        return res.status(200).json(postagens);

    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
};

module.exports = {
    novaPostagem,
    curtir,
    comentar,
    feed
};