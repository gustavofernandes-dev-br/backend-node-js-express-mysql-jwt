const express = require('express');
const routes = express.Router();
const usuario = require('./src/controllers/usuario')
const auth = require('./src/auth/auth');
const jwt = require('jsonwebtoken');
//Regra do token
routes.use(auth);

//USUARIO
routes.get("/usuario", usuario.Consultar)
routes.post("/usuario", usuario.Incluir)
routes.put("/usuario", usuario.Alterar)
routes.delete("/usuario/:id", usuario.Inativar)


routes.get('/logout', function(req, res) {    
    res.status(200).send({ auth: false, token: null });
});



module.exports = routes;




 /**
 
routes.post("/estudoroute/:id",(request,response) => {
    //127.0.0.1:3333/EstudoRoute/1
    //route params, um único recurso
    const params = request.params;
    console.log(params); //query
    return response.json({
        evento: 'Semana Omni',
        Evento: 'Route'
    })
 })

 routes.get("/estudoquery",(request,response) => {
   //Query: parametros nomeados enviados na rota filtros;paginacao
   //127.0.0.1:3333/EstudoQuery?name=Gustavo&senha=123
   const query = request.query;
   console.log(query); //query
   return response.json({
       evento: 'Semana Omni',
       Evento: 'Query'
   })
})
//Post
routes.post("/estudobody",(request,response) => {
    //Body:Paramentros no corpo na mensagem
    //127.0.0.1:3333/EstudoBody
    const body = request.body;
    console.log(body); //query
    return response.json({
        evento: 'Semana Omni',
        Evento: 'Body'
    })
 })
 
 **/