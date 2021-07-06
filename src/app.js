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
  const project = {id: uuid(), title, url, techs, likes: 0};
  repositories.push(project);

  return response.json(project);

});

app.put("/repositories/:id", (request, response) => {
  /** A rota deve alterar apenas o title, a url e as techs do repositório 
   * que possua o id igual ao id presente nos parâmetros da rota; */

  const {title,url} = request.body;
  const {id} = request.params;

  const projectIndex = repositories.findIndex(project => project.id == id);

  if(projectIndex < 0){
    return response.status(400).json({error: "project not found."});
  }

  const project = {id, title, url};
  repositories[projectIndex] = project;
  
  return response.json(project);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const projectIndex = repositories.findIndex(project => project.id == id);

  if(projectIndex < 0){
    return response.status(400).json({error: "project not found."});
  }

  repositories.slice(projectIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;
