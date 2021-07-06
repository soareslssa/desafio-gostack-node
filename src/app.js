const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const {title,url,techs} = request.body;
  const repository = {id: uuid(), title, url, techs, likes: 0};
  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {

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

// cria novo like
app.post("/repositories/:id/like", (request, response) => {

  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if(repositoryIndex < 0){
    return response.status(400).json({error: "repository not found."});
  }

  repositories[repositoryIndex].likes += 1;
  return response.json(repositories[repositoryIndex]);
});

// adiciona nova tech
app.post("/repositories/:id/tech", (request, response) => {

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
