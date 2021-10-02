const Sequelize =  require('sequelize');
const db = require('./db');


const Usuario =db.define('usuarios',{
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
    email:{
        type:Sequelize.STRING,
        allowNull:false,
    }
  
});
//cria a tabela
// antes de cadastrar o segundo desativa essa opcao 
//Usuario.sync({force:true});
//depois deixe assim 
//Usuario.sync();
module.exports = Usuario;