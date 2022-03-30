const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());


const todos = [];


const tarefaPronta = [
  {
    "id": "19f2cb05-0c0f-428b-9846-e61276f29ffb",
    "title": "Tarefa exemplo",
    "done": false,
    "deadline": "2021-02-27T00:00:00.000Z",
    "created_at": "2022-03-24T14:17:53.401Z"
  }
]
const users = [
  {
    "id": "64cf7d46-8127-4d69-88b6-f2c50dd26c96",
    "name": "PH",
    "username": "PH1",
    "todos": tarefaPronta
  }
];

// function procuraUsername(username){
//   const resultado = users.find( usuario => usuario.username === username);
//   return resultado;
// }
// function procuraName(name){
//   const resultado = users.find(usuario=> usuario.name === name);
//   return resultado;
// }
// function procuraID(id){
//   const resultado = users.find(usuario => usuario.id === id);
//   return resultado;
// }

// function retornaTarefaPorIndexUsuario(indexUsername,idTarefa){
//   console.log(idTarefa);
//   const resultado = users[indexUsername].todos.find(todo=> todo.id===idTarefa);
//   return resultado;
// }

// function retornaTarefaPorIndexUsuario1(indexUsername,idTarefa){
//   console.log(idTarefa);
//   const resultado = users[indexUsername].todos.findIndex(todo=> todo.id===idTarefa);
//   return resultado;
// }

// //Pegando o index do Objeto
// function ProcuraIndexUsername(username){
//   const resultado= users.findIndex(usuario=>usuario.username===username)
//   return resultado;
// }

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  //recebendo  name e username
  const{name,username}=request.body;

  //Objeto usuario
  const usuario={
    id:uuidv4(),
    name:name,
    username:username,
    todos:[] 
  };

  const findUsername = users.find(user => user.username === username);
  if(!findUsername){
    users.push(usuario);
    console.log("Usuario adicionado com sucesso");  
  }else{
    return response.status(400).json({error: `Usuario ja existe`});
  }
  return response.status(201).json(usuario);
});



app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const{username} = request.headers;
  const procuraUser = users.find((user)=>{ 
    return user.username=== username;
  });

  if(!procuraUser){
    console.log("Usuario nao existe");
    return response.status(400).json({msg: `Usuario nao existe`}); 
  }
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

  // Percorrendo users
  for( let i=0; i< users.length ; i++ ){
    if(users[i].username === username){
      console.log(newTodo);
      users[i].todos.push(newTodo);
    }
  }  
  return response.status(201).json(newTodo);
  
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const{username} = request.headers;
  const {deadline,title} = request.body;
  const {id} = request.params; 
  const usuario = users.find( user => user.username === username);
  
  if(!usuario){
    return response.status(404).json({error: `Usuario nao encontrado`});
  }

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

  const usuario = users.find( user => user.username === username);
  if(!usuario){
    return response.status(404).json({error: `Usuario nao encontrado`});
  }
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
  if(!usuario){
    return response.status(404).json({error: `Usuario nao encontrado`});
  }
  const findTodo = usuario.todos.find(todo => todo.id === id);
  if(!findTodo){
    return response.status(404).json({error: `Tarefa nao encotrada`});
  }
  usuario.todos.splice(findTodo,1);
  console.log("Tarefa removida com sucesso");
  return response.status(204).json(findTodo);
});

module.exports = app;