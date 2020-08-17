const express = require("express");
const { uuid } = require("uuidv4");

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
let likes = 0;

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Nonexistent repository' })
  }
  
  const repository = { id, title, url, techs, likes };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if ( repositoryIndex < 0) {
    return response.status(400).json({ error: 'Nonexistent repository.'})
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({ error: 'Nonexistent repository'})
  }

  repository.likes++;
  return response.status(200).json(repository);
});

module.exports = app;