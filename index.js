const DatabaseOperations = require('./db');
const prompt = require('prompt');
const dbFilePath = 'kfbank.db';
const dbOperations = new DatabaseOperations(dbFilePath);
const inquirer = require('inquirer');
require('dotenv').config();

const rootUser = process.env.USER;
const rootPass = process.env.PASS;

function init() {
dbOperations.createTable();
 function dados() {
  setTimeout(() => {
  dbOperations.getAllUsuarios((err, rows) => {
    if(err) {
      console.error(err.message);
      return;
    }else {
    console.log('Usuarios:', rows);
      setTimeout(() => {
    dbOperations.closeConnection();
      }, 1000);
    }
  });
}, 1000);
}

function cadastro() {

setTimeout(() => {
  prompt.start();
  prompt.get(['nome', 'email', 'senha', 'confirmarSenha'], function (err, result) {
    if (err) {
      console.error(err.message);
      return;
    }
    if(result.nome == "" || result.email == "" || result.senha == "" || result.confirmarSenha == ""){
      console.log("Campos vazios");
    } else{
  if(result.senha != result.confirmarSenha) {
      console.log('As senhas devem coincidir');
    } else {

    dbOperations.getEmail(result.email, (err, emailExists) => {
      if (err) {
        console.error(err.message);
        return;
      }

      if (!emailExists) {
        dbOperations.insertUsuario(result.nome, result.email, result.senha);
      } else {
        console.log('Email já existe. Insira um email diferente.');
      }

      dbOperations.closeConnection();
    });
    }
    }

  });
}, 1000);

}

function logar() {
setTimeout(() => {
  prompt.start();
  prompt.get(['email', 'senha'], function (err, result) {
    if (err) {
      console.error(err.message);
      return;
    }

  if(result.email == rootUser && result.senha == rootPass){
    console.log("Você é root");
       console.clear();
    showMenuRoot();
  }else {
 if(result.email == "" || result.senha == ""){
      console.log("Campos vazios");
    } else{

    dbOperations.login(result.email, result.senha, (err,loginValido) => {
      if (err) {
        console.error(err.message);
        return;
      }

      if (loginValido) {
       console.log("Login concluído")
      } else {
        console.log("Usuário ou senha inválido");
      }

    });
    
    }
  }

   

  });

}, 1000);
}

const menuOptions = [
  { name: 'Cadastrar', value: cadastro },
  { name: 'Logar', value: logar},
  // { name: 'Banco de dados', value: dados},
  { name: 'Sair', value: 'sair' },
];
async function showMenu() {
  const resposta = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcao',
      message: 'Escolha uma ação:',
      choices: menuOptions,
    },
  ]);

  const escolha = resposta.opcao;

  if (escolha === 'sair') {
    console.log('Saindo do menu.');
  } else {
    escolha();
  }
}

const menuOptionsRoot = [
  { name: 'Banco de dados', value: dados},
  { name: 'Sair', value: 'sair' },
];
async function showMenuRoot() {
  const resposta = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcao',
      message: 'Escolha uma ação:',
      choices: menuOptionsRoot,
    },
  ]);

  const escolha = resposta.opcao;

  if (escolha === 'sair') {
    console.log('Saindo do menu.');
  } else {
    escolha();
  }
}
showMenu();
}

init();









