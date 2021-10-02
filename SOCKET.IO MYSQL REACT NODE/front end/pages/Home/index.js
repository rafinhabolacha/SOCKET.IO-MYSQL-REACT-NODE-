import React, { useEffect, useState } from 'react';
//import {} from 'react-dom';
//import Button from '@material-ui/core/Button';
// instala o socket npm install socket.io-client

import api from '../../services/Api_Config';

import socketIOClient from 'socket.io-client';

 let socket;
function Home() {
 
  //conectando com o back end
  const ENDPOINT ="http://localhost:8086/";

     // usuario esta logado = true
  const [logado ,setLogado]= useState(false);
  const [ nome ,SetNome]= useState("");
  const [ usuarioId ,SetUsuarioId]= useState("");
  const [ email ,SetEmail]= useState("");
  const [ sala ,setSala] = useState("");

  //parte pra enviar a mensagem após os dois esta logado
  const [ mensagem, setMensagem] =useState("");
 // recebendo mensagem do  back end

 const [listaMensagem, setListMensagem ] = useState([])


  useEffect(()=>{
    socket = socketIOClient(ENDPOINT)
  },[])
    // faça teste  ira gerar um id no back end

   //recebendo mensagem do back end
   useEffect(()=>{
     socket.on("receber_mensagem ",(dadosbackend)=>{
       setListMensagem([... listaMensagem, dadosbackend])
     })
   })



  const conectarSala =async e =>{
    e.preventDefault();


    const headers ={
      'Content-Type':'application/json'
    }
          //{email} sera enviado pro back end
    await api.post('/validar_Acesso',{email},{headers}).then((response)=>{
       console.log(response);
       console.log(response.data.usuario.id);
      console.log(response.data.usuario.Nome);
       console.log(response.data.mensagem);
       SetUsuarioId(response.data.usuario.id);
       SetNome(response.data.usuario.Nome);
       setLogado(true); 
       socket.emit("sala_conectar",sala);
       listarMensagens(); 
    }).catch((err)=>{
      if(err.response){
       console.log(err.response.data.mensagem);
      }else{
        console.log("Error: Tente mais tarde  B!")
      }
    })
       console.log("acessou a sala "+sala+ "com o E-mail "+ email );
        // depois  de testa faça essa parte
          
        //usuario esta logado
        // setLogado(true);
          //enviar para o back end a sala 
          // " posição" e variavel  sala 
          //socket.emit("sala_conectar",sala);
            // cria o formulario  na parte de logado 
  }

  const  listarMensagens = async () =>{
    await api.get("/listar_mensagem/"+ sala)
    .then((response)=>{
      console.log(response);
      console.log(response.data.mensagens);
      setListMensagem(response.data.mensagens);
    }).catch((err)=>{
      if(err.response){
        console.log(err.response.data.mensagem);
      }else{
        console.log("Error: Tente mais tarde A");
      }
    })
 }
  // apos esta logado faça o formulario de mensagens

  const enviarMensagem = async e =>{
    e.preventDefault();
    
 console.log("mensagem :" + mensagem);
  // enviando mensagem para o back end

  const conteudomensagem ={
    sala: sala,
    conteudo:{
     nome,
      mensagem,
      usuario:{
        id: usuarioId,
        nome: nome
      }
    }
  }

  console.log(conteudomensagem);
   //enviar usa emit();
   //"enviar_mensagem" = posicao sera utilizada no back end 
  await socket.emit("enviar_mensagem",conteudomensagem);

   



  // recebendo a mensagem no front end
  setListMensagem([... listaMensagem, conteudomensagem.conteudo])
  setMensagem("")
  }

    return (
      <div>
        <h1>Web chat {nome}...</h1>
        
       {!logado ? 
       <>
         <form onSubmit={conectarSala}>
        <label>E-mail:</label>
        <input type="text" name="email" value={email}  onChange={(text)=>{SetEmail(text.target.value)}}/><br /><br />
       
        <label>Sala:</label>
      {/*  <input type="text" placeholder="Sala" value={sala}  onChange={(text)=>{setSala(text.target.value)}}/><br /><br />*/}

        <select name="sala" value={sala} onChange={text =>setSala(text.target.value)}>
         <option value="">Selecione</option>

         <option value="1">HTML</option>
         <option value="2">NODE.JS</option>
         <option value="3">SOCKET.IO</option>
         <option value="4">REACT</option>  

        </select><br /><br />
        
      <button type="submit">Acessar</button>
       </form>
       </>
        :/*"logado"*/
  //após os teste e os dois esta logado  fazer formulario pra conversar 
  
        <>
        {listaMensagem.map((msg,key)=>{
           return (
           <div key={key}>
              {msg.nome}:{msg.mensagem}

             
             
           </div>  
           ) 
        })}
        <form onSubmit={enviarMensagem}>
         <input type="text" name="mensagem" placeholder="mensagem" value={mensagem} onChange={(text) => {setMensagem(text.target.value)}} />

         <button type="submit" /*onClick=enviarMensagem}*/>Enviar</button>
         </form>
        </>          
        
        }
     </div>
    );
  }
  
  export default Home;
  