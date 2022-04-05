const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const todos = [];
const tarefaPronta = [];
const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const{username} = request.headers;
  const findUsername = users.find(user => user.username === username);
  
  if(!findUsername){
    return response.status(404).json({error: `Usuario nao existe, msg mid`});
  }
  next();
}


app.post('/users', (request, response) => {
  // Complete aqui
  
  const{name,username}=request.body;

  //Objeto usuario
  const usuario={
    id:uuidv4(),
    name:name,
    username:username,
    todos:[] 
  };

  const findUsername = users.find(user => user.username === username);
  if(findUsername){
    return response.status(400).json({error: `Usuario ja existe`});
  }

  users.push(usuario);
  return response.status(201).json(usuario);
});



app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const{username} = request.headers;
  const procuraUser = users.find((user)=>{ 
    return user.username=== username;
  });
  return response.status(200).json(procuraUser.todos); 
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const{username} = request.headers;
  const {deadline,title} = request.body;
  const newTodo={
    id:uuidv4(),
    title:title,
    done:false,
    deadline:new Date(deadline),
    created_at: new Date()
  }
 
  const usuario = users.find(user => user.username === username);

  if(!usuario){
    return response.status(404).json({error: `Usuario nao existe`});
  }

  if(usuario){

    usuario.todos.push(newTodo);
    return response.status(201).json(newTodo);
  }

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const{username} = request.headers;
  const {deadline,title} = request.body;
  const {id} = request.params; 
  const usuario = users.find(user => user.username === username);
  const findTodo = usuario.todos.find( todo => todo.id === id);
  
  if(!findTodo){
    return response.status(404).json({error: `Tarefa nao encontrada`});
  }
  
  findTodo.deadline = deadline;
  findTodo.title = title;
 
  return response.status(200).json(findTodo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request.headers;
  const {id} = request.params; 
  const{done}=request.body;
  const usuario = users.find(user => user.username === username);
  const findTodo = usuario.todos.find(todo =>todo.id ===id);

  if(!findTodo){
    return response.status(404).json({error: `Tarefa nao encontrada`});
  } 
  findTodo.done = true;
  return response.status(200).json(findTodo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username}=request.headers;
  const{id}=request.params;
  const usuario = users.find(user => user.username === username);
  const findTodo = usuario.todos.find(todo => todo.id === id);

  if(!findTodo){
    return response.status(404).json({error: `Tarefa nao encotrada`});
  }
  usuario.todos.splice(findTodo,1);
  return response.status(204).json(findTodo);
});

module.exports = app;