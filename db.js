const sqlite3 = require('sqlite3').verbose();

class DataOperations {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath);
  }

  createTable() {
    this.db.run('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, senha TEXT)');
  }

  insertUsuario(nome, email, senha){
    const stmt = this.db.prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)');
    stmt.run(nome,email,senha);
    stmt.finalize();
  }
  login(email, senha, callback){
    const pull = this.db.prepare('SELECT * FROM usuarios WHERE email = ? AND senha = ?');
    pull.get(email, senha, (err, row) => {
      if (err) {
        console.error('Erro ao buscar email:', err.message);
        return callback(err, null);
      }
        
      if (row) {
        console.log('Login válido');
        callback(null, true);
      } else {
        console.log('Login inválido');
        callback(null, false);
      }
        pull.finalize();
    });


  }



   getEmail(email, callback) {
    const pull = this.db.prepare('SELECT email FROM usuarios WHERE email = ?');
    
    pull.get(email, (err, row) => {
      if (err) {
        console.error('Erro ao buscar email:', err.message);
        return callback(err, null);
      }
        
      if (row) {
        console.log('Email existente');
        callback(null, true);
      } else {
        console.log('Email novo');
        callback(null, false);
      }
        pull.finalize();
    });
  }

   
   getAllUsuarios(callback){
    this.db.all('SELECT * FROM usuarios', (err, rows) => {
      if(err) {
        return callback(err, null);
      }
      callback(null, rows);
    });
  }

  closeConnection() {
    this.db.close();
  }
}

module.exports = DataOperations;
