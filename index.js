const express = require('express');
const _ = require('underscore');

const server = express();

server.use(express.json());

function setIndex(req, res, next){
  const id = req.params.id;
  const index = _.findIndex(projects, {id: id});

  if(index < 0){
    return res.status(400).json({message: "Project not found"});
  }

  req.projectIndex = index;
  next();
}

const projects = [];

server.post('/projects', (req, res) =>{
  const {id, title, tasks} = req.body;
  projects.push({id: id
    , title: title
    , tasks: tasks });
  return res.json({message: "Project created with success"});
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', setIndex, (req, res) => {
  const {title} = req.body;

  if(!title){
    return res.status(400).json({message: "Title is required"});
  }
  projects[req.projectIndex].title = title;

  return res.json({message: "Project updated"});
});


server.delete('/projects/:id', setIndex, (req, res) =>{
  projects.splice(req.projectIndex, 1);
  return res.json({message: "Project deleted"});
});


server.post('/projects/:id/task', setIndex, (req, res) => {
  const {title} = req.body;

  if(!title){
    return res.status(400).json({message: "Title is required to task"});
  }
  projects[req.projectIndex].tasks.push(title);

  return res.json({message: `Task added to Project ${projects[req.projectIndex].title}`});
});

server.listen(3000);