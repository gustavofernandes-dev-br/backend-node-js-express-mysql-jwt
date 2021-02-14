const conn = require("../database/conectarbanco-mysql")
const criptografia = require("../utils/criptografia")
const jwt = require('jsonwebtoken');
const authConfig = require('../auth/auth.json');


function gerarToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    });
}

async function verificarUsuario(req,res){
    try {
        let sql = `SELECT ID,NOME,EMAIL,SENHA,INATIVO FROM USUARIO WHERE EMAIL = ? `
        const dados = await conn.SqlPegarCampos(sql,[req.body.EMAIL])
        if(dados[0])
        {
            const{ID,NOME,EMAIL,SENHA,INATIVO,PERFIL} = dados[0]
            if (INATIVO)
            {
                return res.status(203).json({"status":"Usuário inativo."})
            }
            else if(req.body.SENHA == await criptografia.decrypt(SENHA) )
            {
                const sToken = await gerarToken({"idUsuario":ID});
                return res.json({ 
                    "token": sToken, 
                    "idUsuario": ID,
                    "acesso": PERFIL,
                    "nome": NOME
                })

               // return res.status(200).json({"status":"Login aceito"})
            }
            else
            {
                return res.status(203).json({"status":"Senha inválida."})
            }
        }
        else
        {
            return res.status(203).json({"status":"Usuario inexistente."})
        }
 
    } catch (error) {
        
    }
    
     
}
module.exports = {verificarUsuario}