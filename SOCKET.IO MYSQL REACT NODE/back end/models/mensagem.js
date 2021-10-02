const Sequelize =  require('sequelize');
const db = require('./db');

//models  
const Usuario = require('./usuario');
const Sala = require('./salas');


const Mensagem =db.define('mensagens',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    salaId:{
        type:Sequelize.INTEGER,
        allowNull:false,

    },
    mensagem:{
        type:Sequelize.TEXT,
        allowNull:false,
    },
    usuarioId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    }
  
});
// criando ligação de chave primaria com chave estrangeira no node.js
// usuarioId é uma chave estrangeira de Usuario
Mensagem.belongsTo(Usuario,{foreignkey:' usuarioId', allowNull:false})
Mensagem.belongsTo(Sala,{foreignkey:'salaId', allowNull:false})







//cria a tabela
// antes de cadastrar o segundo desativa essa opcao 
//Usuario.sync({force:true});
//depois deixe assim 

//quando se cria uma chave estrangeira tem que usar esse comando 
//Mensagem.sync({alter : true});

module.exports = Mensagem;