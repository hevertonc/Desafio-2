const express = require("express");
const cors = require("cors");

 const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = { 
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repIndex = repositories.findIndex(rep => rep.id === id);

  if (repIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!'});
  }

  const likes = repositories[repIndex].likes;

  const repository = { 
    id,
    url,
    title,
    techs,
    likes
  }

  repositories[repIndex] = repository;

  return response.json(repository);  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repIndex = repositories.findIndex(rep => rep.id === id);

  if (repIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!'});
  }

  repositories.splice(repIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repIndex = repositories.findIndex(rep => rep.id === id);

  if (repIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!'});
  }

  const repository = repositories[repIndex];
  repository.likes++;

  repositories[repIndex] = repository;

  const likes = {
    likes: repositories[repIndex].likes
  }

  return response.json(likes);
});

module.exports = app;
