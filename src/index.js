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

function procuraUsername(username){
  const resultado = users.find( usuario => usuario.username === username);
  return resultado;
}
function procuraName(name){
  const resultado = users.find(usuario=> usuario.name === name);
  return resultado;
}
function procuraID(id){
  const resultado = users.find(usuario => usuario.id === id);
  return resultado;
}

function retornaTarefaPorIndexUsuario(indexUsername,idTarefa){
  console.log(idTarefa);
  const resultado = users[indexUsername].todos.find(todo=> todo.id===idTarefa);
  return resultado;
}

function retornaTarefaPorIndexUsuario1(indexUsername,idTarefa){
  console.log(idTarefa);
  const resultado = users[indexUsername].todos.findIndex(todo=> todo.id===idTarefa);
  return resultado;
}

//Pegando o index do Objeto
function ProcuraIndexUsername(username){
  const resultado= users.findIndex(usuario=>usuario.username===username)
  return resultado;
}

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

  
  
  if((procuraUsername(username)===undefined)){
    users.push(usuario);
    console.log("Usuario adicionado com sucesso");
  }else{
    console.log("Usuario ja existente");
    return response.status(400).json({error: `Usuario ja existe`});
  }
  
  return response.status(201).json(usuario);
});



app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  // Recebendo usuario
  const{username} = request.headers;
  
  const procuraUser = users.find((user)=>{ 
    // console.log(user);
    
    return user.username=== username;
  });
  
  if(procuraUser=== undefined){
    console.log("Usuario nao existe");
    return response.json({msg: `Usuario nao existe`}); 
  }else{
  // console.log(procuraUser);
    console.log(`As tarefas do usuario ${procuraUser.username} sao: `)
    console.log(procuraUser.todos);

    //Concatena
    //Retornando um array com todas as tarefas === todos
    // return response.json({msg:`Tarefas do usuario ${username}`,todos:procuraUser.todos});
    return response.json(procuraUser.todos);
  }
});




app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const{username} = request.headers;
  const {deadline,title} = request.body;

  // console.log(request.body);
  // if(title===undefined){
  //   console.log("Nao ta passando title");
  // }
  //criando novo todo
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
    console.log(`Novo todo para ${users[i]}, agora suas tarefas sao: ${users[i].todos}`);
  }  
  return response.status(201).json(newTodo);
  
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const{username} = request.headers;
  console.log(username);
  const {deadline,title} = request.body;
  const {id} = request.params; 
  
  //Procuro o Usuario
  const UsuarioEncontrado = ProcuraIndexUsername(username);

  

  if(UsuarioEncontrado=== -1){
    console.log("Usuario nao encontrado pelo Username");
  }else{
    console.log(users[UsuarioEncontrado])
    //Procurar id da tarefa do usuario
      const tarefaEncontrada = retornaTarefaPorIndexUsuario(UsuarioEncontrado,id);
      if(tarefaEncontrada === undefined){
        console.log("Tarefa nao encontrada");
        return response.status(404).json({error: `Tarefa nao existe`});
      }else{
        console.log(tarefaEncontrada);
        console.log("TAREFA ENCONTRA ACIMA")
        tarefaEncontrada.title = title;
        tarefaEncontrada.deadline = deadline;
        
        return response.json(tarefaEncontrada);
      }
      
      // console.log(IDtarefaEncontrada);
      
    }

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {username} = request.headers;
  const {id} = request.params; 
  const{done}=request.body;


  //Procuro o Usuario
  const UsuarioEncontrado = ProcuraIndexUsername(username);
  if(UsuarioEncontrado=== -1){
    console.log("Usuario nao encontrado pelo Username");
  }else{
    console.log(users[UsuarioEncontrado])
    //Procurar id da tarefa do usuario
      const tarefaEncontrada = retornaTarefaPorIndexUsuario(UsuarioEncontrado,id);
      if(tarefaEncontrada === undefined){
        console.log("ID DA TAREFA N ENCOTRADO");
        return response.status(404).json({error: `Tarefa nao existe`});
     
      }else{
        console.log(tarefaEncontrada);
        tarefaEncontrada.done=true;
        console.log("Status da Tarefa alterada parada Done");
        return response.json(tarefaEncontrada);
      }
      
      // console.log(IDtarefaEncontrada);
      
    }
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  console.log("username");
  const {username}=request.headers;
  console.log(username);
  const{id}=request.params;

  //Procuro o Usuario
  const UsuarioEncontrado = ProcuraIndexUsername(username);
  if(UsuarioEncontrado=== -1){
    console.log("Usuario nao encontrado pelo Username");
  }else{
    console.log(users[UsuarioEncontrado])
    //Procurar id da tarefa do usuario
      const TarefaEncontradaIndex = retornaTarefaPorIndexUsuario1(UsuarioEncontrado,id);
      if(TarefaEncontradaIndex===-1){
          ///ERRROR 404
          console.log("Tarefa nao existe");
          return response.status(404).json({error: `Tarefa nao existe`});
      }else{
        const TarefaDeletada = users[UsuarioEncontrado].todos.splice(TarefaEncontradaIndex,1);
        // console.log(IDTarefaEncontradaIndex);
        console.log("Usuario deletado com sucesso!");
        return response.status(204).json(TarefaDeletada);
      }
    }
});

module.exports = app;



/// CORREÇÔES
// rota put
