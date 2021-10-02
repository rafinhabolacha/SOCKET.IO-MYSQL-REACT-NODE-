const express = require('express');
const app = express();
const cors = require('cors');
const socket = require('socket.io');

const Usuario  = require('./src/models/Usuario');
const Mensagem  = require('./src/models/mensagem');
const Sala  = require('./src/models/salas');

app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");     
  res.header("Access-Control-Allow-Headers", "X-PINGOTHER,Content-Type,Authorization");
  app.use(cors())
  next();    
});

app.use(express.json());

app.get('/listar_mensagem/:sala', async (req,res)=>{
    const {sala} =req.params;

    await Mensagem.findAll({
      order:[['id','ASC']],
      where:{
        salaId: sala,
      },
      //pesquisar de model
      include:[{
        model:Usuario,
      },{
        model: Sala
      }]
    }).then((mensagens)=>{
        return res.json({
          error:false,
          mensagens
        });
    }).catch((err)=>{
      return res.json({
        error:true,
        mensagem:"Nenhuma mensagem encontrada!"
      });
    })
});

//================ banco de dados======================

app.post('/cadastrar_Salas', async (req,res) =>{
  //res.send("cadastrando contato");
   const dados = req.body;
  await Sala.create(dados)
  .then(()=>{
     return res.json({
       error: false,
       mensagem:"Nova Sala com sucesso",
       usuario: dados
     });
  }).catch(()=>{
    return res.status(400).json({
      error: true,
      mensagem:"Error: Sala não Gerada com sucesso",
     });  
  }); 

});

app.post('/cadastrar_mensagem', async (req,res) =>{
  //res.send("cadastrando contato");
   const dados = req.body;
  await Mensagem.create(dados)
  .then(()=>{
     return res.json({
       error: false,
       mensagem:"mensagem enviada com sucesso",
       usuario: dados
     });
  }).catch(()=>{
    return res.status(400).json({
      error: true,
      mensagem:"Error: mensagem não enviada com sucesso",
     });  
  }); 

});



app.post('/cadastrar_usuario', async (req,res) =>{
  //res.send("cadastrando contato");
   const dados = req.body;

   // não cadastrar dois email iguais
   const usuario = await Usuario.findOne({
     where:{
       email: dados.email
     }
   });
   //se encontrou um usuario
   if(usuario){
      return res.status(400).json({
        error:true,
        mensagem:"Error: este E-mail ja esta Cadastrado!"
      })
   }
  await Usuario.create(dados)
  .then(()=>{
     return res.json({
       error: false,
       mensagem:"Usuario Cadastrado com sucesso",
       usuario: dados
     });
  }).catch(()=>{
    return res.status(400).json({
      error: true,
      mensagem:"Error: Usuario não Cadastrado com sucesso",
     });  
  }); 
   

});
app.post('/validar_Acesso', async (req,res)=>{
   //res.send("validando usuario");

  const usuario = await Usuario.findOne({
    //retorna só  que for util
    attributes: ['id','Nome'],
    where:{ 
      email: req.body.email
    }
    });
    if(usuario === null){
      return res.status(400).json({
        error:true,
        mensagem:"Error: usuario não encontrado!"
      });
    }
    return res.json({
      error:false,
      mensagem:"Login efetuado com sucesso!",
      usuario: usuario
    })
  });



//=======================================================================



const server = app.listen(8086,function(){
  console.log('servidor rodando !');
})
// qualquer url pode fazer requisição  ao socket
 io = socket(server,{cors:{origin: "*"}});
 // recebe a resposta
 io.on('connection',(socket)=>{
   // quando recebo uma resposta gera se um id pra cada usuario 
  console.log(socket.id); // chave de cada usuario

  // é  va pra o front end  depois retorne

   //recebendo do front end posição a sala_conectar
   socket.on("sala_conectar",(dadosFront) =>{
     // recebe o valor sendo a sala
     socket.join(dadosFront);
     console.log("sala selecionada"+dadosFront);
   });

   //recebendo do front end  a mensagem
   
   socket.on("enviar_mensagem",(dadosmensagemFront)=>{
     console.log(dadosmensagemFront);
// salvar no banco as mensagem
      Mensagem.create({
        mensagem: dadosmensagemFront.conteudo.mensagem,
        usuarioId: dadosmensagemFront.conteudo.usuario.id,
        salaId: dadosmensagemFront.sala
      })
     // para enviar 
     socket.to(dadosmensagemFront.sala)
     //pra todos que estao nessa sala
     //envia pro front_end
     .emit("receber_mensagem ",dadosmensagemFront.conteudo);

     
     

   })

 })



