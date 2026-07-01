# Nosso Mini Insta

Mini Insta é um projeto de estudo que simula uma versão simplificada do Instagram, com login, perfil, postagens, curtidas e comentários.

> Projeto baseado em um escopo de API fictício, definido a partir de imagens e requisitos passados por um "cliente" fictício durante a aula. O escopo original foi documentado em [HackMD](#) *(adicione aqui o link do seu documento)* e está replicado/atualizado neste README.

## Status do projeto

🚧 Em desenvolvimento — projeto de estudo.

## Funcionalidades

### O que o usuário pode fazer

- Fazer login
- Fazer cadastro
- Ver os dados do seu perfil
- Editar os dados do seu perfil
- Ver postagens de outras pessoas
  - Ver quantidade de curtidas em uma postagem
  - Ver os comentários em uma postagem
- Curtir postagens de outras pessoas
- Comentar em postagens

### O que não será possível fazer (fora do escopo)

- Ver a localização de uma postagem
- Ver pessoas que curtiram uma postagem
- Curtir um comentário
- Comentar em outros comentários

## Tecnologias utilizadas

- *(preencher: linguagem, framework, etc.)*
- PostgreSQL (banco de dados)

## Modelo de dados

Tabelas principais:

- `usuarios` — dados de cadastro e perfil
- `postagem` — postagens feitas pelos usuários
- `postagem_foto` — fotos de cada postagem (1 postagem pode ter várias fotos)
- `postagem_comentarios` — comentários feitos em postagens
- `postagem_curtidas` — curtidas em postagens (chave composta `usuario_id` + `postagem_id`)

*(opcional: adicionar aqui um diagrama ER, gerado por exemplo em [dbdiagram.io](https://dbdiagram.io) ou com [Mermaid](https://mermaid.js.org/))*

## Endpoints

### `POST` /login

**Dados enviados**
- `username`
- `senha`

**Dados retornados**
- `sucesso` / `erro`
- `token`

---

### `POST` /cadastro

**Dados enviados**
- `username`
- `senha`

**Dados retornados**
- `sucesso` / `erro`

---

### `GET` /perfil

**Dados enviados**
- `token` (contém `id` ou `username`)

**Dados retornados**
- URL da foto
- Nome
- Username
- Site
- Bio
- Email
- Telefone
- Gênero

---

### `POST` /perfil

**Dados enviados**
- `token` (contém `id` ou `username`)
- URL da foto
- Nome
- Username
- Site
- Bio
- Email
- Telefone
- Gênero

**Dados retornados**
- `sucesso` / `erro`

---

### `GET` /postagens

**Dados enviados**
- `token`
- `offset`

**Dados retornados**
- `Postagens []`
  - `id`
  - `foiCurtidoPorMim`
  - `Usuario`
    - URL da foto
    - `username`
    - `ehPerfilOficial`
  - `Fotos []`
  - `quantidadeDeCurtidas`
  - `Comentarios []`
    - `username`
    - `texto`
  - `Data`

---

### `POST` /curtir

**Dados enviados**
- `token` (contém `username` ou `id` do usuário)
- `idDaPostagem`

**Dados retornados**
- `sucesso` / `erro`

---

### `POST` /comentar

**Dados enviados**
- `token` (contém `username` ou `id` do usuário)
- `idDaPostagem`
- `texto`

**Dados retornados**
- `sucesso` / `erro`

## Como rodar o projeto

```bash
# clonar o repositório
git clone <url-do-repositorio>
cd nosso-mini-insta

# (preencher: instalação de dependências, variáveis de ambiente, etc.)
```

## Licença

Projeto de estudo, sem licença comercial definida.
