const knex = require('../bd');

const obterPostagens = async (req, res) => {
    const { id } = req.usuario;

    try {
        const postagens = await knex('postagem')
            .join('usuarios', 'postagem.usuario_id', 'usuarios.id')
            .select(
                'postagem.id',
                'postagem.texto',
                'postagem.data',
                'usuarios.username',
                'usuarios.imagem as usuario_imagem',
                'usuarios.verificado as e_perfil_oficial'
            );

        if (postagens.length === 0) {
            return res.status(404).json({ mensagem: 'Não há postagens' });
        }

        return res.status(200).json(postagens);
    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

module.exports = {
    obterPostagens
}