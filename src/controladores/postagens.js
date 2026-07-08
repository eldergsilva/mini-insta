const knex = require('../bd');

const novaPostagem = async (req, res) => {
    const { id } = req.usuario;
    const { texto, fotos } = req.body;
    
    if (fotos && fotos.length === 0) {
        return res.status(400).json({ mensagem: 'É necessário enviar ao menos uma foto' });
    }

    try {
        const postagem = await knex('postagem').insert({
            usuario_id: id,
            texto            
        }).returning('*');

        if(!postagem) {
            return res.status(400).json({ mensagem: 'Não foi possível concluir a postagem' });
        }

        for (const foto of fotos) {
            foto.postagem_id = postagem[0].id;
        }
         
        const fotosCadastradas = await knex('postagem_foto').insert(fotos).returning('*');

        if(!fotosCadastradas){
            await knex('postagem').where({ id: postagem[0].id }).del();
            return res.status(400).json({ mensagem: 'Não foi possível cadastrar as fotos da postagem' });
        }
        return res.status(200).json({ mensagem: 'Postagem criada com sucesso' });

    }catch (error) {
        return res.status(500).json(error.message);
    }

    
};

const curtir = async (req, res) => {    
    const {id} = req.usuario;
    const {postagemId} = req.params;

    try {
        const postagem = await knex('postagem').where({id: postagemId}).first();
        if(!postagem){
            return res.status(404).json({mensagem: 'Postagem não encontrada'});
        }
        
        const JaCurtiu = await knex('postagem_curtidas').where({usuario_id: id, postagem_id: postagemId}).first();
        if(JaCurtiu){
            return res.status(400).json({mensagem: 'Você já curtiu essa postagem'});
        }
       const curtida = await knex('postagem_curtidas').insert({usuario_id: id, postagem_id: postagemId});

       if( !curtida){
        return res.status(400).json({mensagem: 'Não foi possível curtir a postagem'});
       }
       
       return res.status(200).json({mensagem: 'Postagem curtida com sucesso'});
    }catch (error) {
        return res.status(500).json(error.message);
    }    
}    

module.exports = {
    novaPostagem,
    curtir
}