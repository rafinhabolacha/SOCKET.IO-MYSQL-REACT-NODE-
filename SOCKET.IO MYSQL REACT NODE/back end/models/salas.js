const Sequelize =  require('sequelize');
const db = require('./db');


const Sala =db.define('salas',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    Nome:{
        type:Sequelize.STRING,
        allowNull:false,

    },
  
});
//cria a tabela
// antes de cadastrar o segundo desativa essa opcao 
//Usuario.sync({force:true});
//depois deixe assim 
//Sala.sync();
module.exports = Sala;