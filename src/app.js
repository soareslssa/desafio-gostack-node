const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // rota que lista todos os repositorios

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  /**
   * A rota deve receber title, url e techs dentro do corpo da requisição, 
   * sendo a URL o link para o github desse repositório. Ao cadastrar um novo
   *  projeto, ele deve ser armazenado dentro de um objeto no seguinte formato: 
   * { id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...', 
   * techs: ["Node.js", "..."], likes: 0 }; Certifique-se que o ID seja um UUID,
   *  e de sempre iniciar os likes como 0.
   */
  const {title,url,techs} = request.body;
  const repository = {id: uuid(), title, url, techs, likes: 0};
  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  /** A rota deve alterar apenas o title, a url e as techs do repositório 
   * que possua o id igual ao id presente nos parâmetros da rota; */

  const {title,url, techs} = request.body;
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: "repository not found."});
  }

  const repository = repositories[repositoryIndex];
  repository.title = title;
  repository.url = url;
  repositories.techs = techs;

  repositories[repositoryIndex] = repository;
  
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: "repository not found."});
  }

  repositories.slice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  /**
   *  A rota deve aumentar o número de likes do repositório específico 
   * escolhido através do id presente 
   * nos parâmetros da rota, a cada chamada dessa rota, o número de likes 
   * deve ser aumentado em 1;
   */

  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if(repositoryIndex < 0){
    return response.status(400).json({error: "repository not found."});
  }

  repositories[repositoryIndex].likes += 1;
  return response.json(repositories[repositoryIndex]);
});

app.post("/repositories/:id/tech", (request, response) => {
  /**
   *  A rota deve adicionar uma nova tech mantem as techs do repository
   */

  const {id} = request.params;
  const {tech} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if(repositoryIndex < 0){
    return response.status(400).json({error: "repository not found."});
  }

  const repository = repositories[repositoryIndex];
  repository.techs = [...repository.techs, tech];

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
