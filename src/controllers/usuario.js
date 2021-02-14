const conn = require("../database/conectarbanco-mysql")
const criptografia = require("../utils/criptografia")

class USUARIO {
    NOME = ""
    EMAIL = ""
    SENHA = ""
    CPF_CNPJ = ""
    CADASTRO = null
    ATUALIZACAO = null
    INATIVO = false
    ID = 0
    PERFIL = 0
}




async function Incluir(req,res)
{
    try {
        USUARIO = req.body;
        if(USUARIO.EMAIL != "")
        {
            let sql = "SELECT ID FROM USUARIO WHERE EMAIL = ? "
            const email = USUARIO.EMAIL
            if(await conn.SqlVerificarSeExiste(sql,email))
            {
                return res.status(203).json({"status":"Email já existe"})
            }
            else
            {
                USUARIO.SENHA = criptografia.encrypt(USUARIO.SENHA)
                sql = `INSERT INTO USUARIO (EMAIL,SENHA,NOME,CPF_CNPJ,CADASTRO,ATUALIZACAO,INATIVO,PERFIL) 
                VALUES (?,?,?,?,?,?,?,?) ` 
                USUARIO.CADASTRO = new Date()
                USUARIO.ATUALIZACAO = new Date()
                console.log(USUARIO.CADASTRO)

                if(await conn.SqlExecutar(sql, [USUARIO.EMAIL, USUARIO.SENHA,USUARIO.NOME,USUARIO.CPF_CNPJ,
                    USUARIO.CADASTRO,USUARIO.ATUALIZACAO,0,USUARIO.PERFIL])) 
                    return res.status(200).json({"status":"ok"})
                else
                    return res.status(400).json({"status":"erro durante a inclusão"})

            }

        }
        else
        {
            return res.status(400).json({"status":"Erro ao processar inclusão"})
        }
        
    } 
    catch (error) 
    {
        console.log(error)
        return res.status(400).json({"status":"Erro ao processar inclusão"})
    }
}
async function Consultar(req,res)
{
    console.log(req.decoded.idUsuario)
    console.log(process.env.teste)
    try {
        sql = "SELECT * FROM USUARIO WHERE ID > ? "
        const dados = await conn.SqlPegarCampos(sql,[0])
        res.json(dados)
    } 
    catch (error) 
    {
        console.log(error)
    }
}
async function Alterar(req,res)
{
    try {
        USUARIO = req.body;        
        if(USUARIO.EMAIL != "")
        {
            let sql = "SELECT ID FROM USUARIO WHERE ID = ? "
            const email = USUARIO.ID
            if(!await conn.SqlVerificarSeExiste(sql,email))
            {
                return res.status(203).json({"status":"Id informada inexistente."})
            }
            else
            {
                USUARIO.SENHA = criptografia.encrypt(USUARIO.SENHA)
                sql = `UPDATE USUARIO SET NOME = ?,SENHA = ?,INATIVO = ?, CPF_CNPJ = ?, ATUALIZACAO = now(),PERFIL = ? WHERE ID = ? ` 
                USUARIO.ATUALIZACAO = new Date()
                if(await conn.SqlExecutar(sql, [USUARIO.NOME,USUARIO.SENHA,USUARIO.INATIVO,USUARIO.CPF_CNPJ,USUARIO.ID,USUARIO.PERFIL])) 
                    return res.status(200).json({"status":"ok"})
                else
                    return res.status(400).json({"status":"erro durante a alteração"})
            }


        }
        else
        {
            return res.status(400).json({"status":"Erro ao processar alteração"})
        }
        
    } 
    catch (error) 
    {
        console.log(error)
        return res.status(400).json({"status":"Erro ao processar inclusão"})
    }
}
async function Inativar(req,res)
{
    try {
        const {id} = req.params
        if(id != 0  && parseInt(id))
        {
            let sql = "SELECT ID FROM USUARIO WHERE ID = ? "
            if(!await conn.SqlVerificarSeExiste(sql,id))
            {
                return res.status(203).json({"status":"Id informada inexistente."})
            }
            else
            {
                sql = `UPDATE USUARIO SET INATIVO = 1, ATUALIZACAO = now() WHERE ID = ? ` 
                if(await conn.SqlExecutar(sql, id)) 
                    return res.status(200).json({"status":"ok"})
                else
                    return res.status(400).json({"status":"Erro ao inativar"})
            }


        }
        else
        {
            return res.status(400).json({"status":"Erro ao inativar"})
        }
        
    } 
    catch (error) 
    {
        console.log(error)
        return res.status(400).json({"status":"Erro ao processar inclusão"})
    }
}

module.exports = {Incluir,Alterar,Inativar,Consultar}