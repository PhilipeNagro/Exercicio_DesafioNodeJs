const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());


const todos = [];

const users = [
  {
    "id": "64cf7d46-8127-4d69-88b6-f2c50dd26c96",
    "name": "PH",
    "username": "PH1",
    "todos": []
  }
];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  next();
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
  
  return response.json(usuario);

});



app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  // Recebendo usuario
  const{username} = request.headers;
  
  //const todos = username.todos;
  // console.log(users);

  const procuraUser = users.find( (user)=>{ 
    // console.log(user);
    return user.username=== username;
  }); 


  // console.log(procuraUser);
  console.log(users);

  //Retornando um array com todas as tarefas === todos
  return response.json(procuraUser.todos);
});




app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const{username} = request.headers;
  console.log(username);
  const {deadline,title} = request.body;
  
  //criando novo todo
  const newTodo={
    id:uuidv4(),
    title:title,
    done:false,
    deadline:new Date(deadline),
    created_at: new Date()
  }

  for( let i=0; i< users.length ; i++ ){
    if(users[i].username === username){
      users[i].todos.push(newTodo);
    }
    console.log(users[i]);
  }  
  
  return response.json(newTodo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const{username} = request.headers;
  
  
  if(username === username.id){
    username.title = title;
    return response.json({msg: `title atualizado com sucesso`});
  }

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;


/*
{

  - Olhar rota post/
}

*/