const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
}

app.post('/users', (request, response) => {
  // Complete aqui
  //recebendo  name e username
  const{name,username}=request.body;

  const usuario={
    id:uuidv4(),
    name:name,
    username:username,
    todos:[] 
  };

  users.push(usuario);
  return this.response.json(usuario);

});



app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  // Recebendo usuario
  const{username} = request.header;
  
  const todos = username.todos;

  return response.json(todos);


});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;