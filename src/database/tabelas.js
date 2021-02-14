const conn = require("./conectarbanco-mysql")
const criptografia = require("../utils/criptografia")

async function VerificarCampo(tabela,campo,tipo,padrao)
{
    try {
   
        let sql = `SHOW COLUMNS FROM ${tabela} WHERE FIELD = '${campo}' `
        const resultado = await conn.SqlPegarCampos(sql)
        if(!resultado[0])
        {
            sql = `ALTER TABLE  ${tabela} ADD COLUMN ${campo} ${tipo} DEFAULT ${padrao} `
            console.log(sql)
            if(!await conn.SqlExecutar(sql))
            {
                console.log("falha ao criar campo:" + tabela + "." + campo)
                return false;
            }
            else
            {
                console.log("Campo criado:" + tabela + "." + campo)
                return true
            }

        }
        else
        {
            const {Field,Type,Null,Key,Default,Extra} = resultado[0]
            //console.log(resultado[0])
            let ok = true;
            if(tipo != Type)
            {
                ok = false
                console.log("tipo errado \n" + tipo + " \n" + Type)
            }
            if(padrao != Default)
            {
                ok = false
                console.log("padrão errado \n" + "Certo:" + padrao + " \n" + "Errado:" + Default)
            }
            if (!ok)
            {
                console.log("Diferença no campo detectada")
                sql = `ALTER TABLE  ${tabela} CHANGE COLUMN ${campo} ${campo} ${tipo} `
                console.log(sql)
                let alterou = false;
                if(!await conn.SqlExecutar(sql))
                {
                    console.log("falha ao atualizar campo" + tabela + "." + campo)
                    return false
                }
                else
                {
                    alterou = true
                }
                sql = `ALTER TABLE  ${tabela} ALTER COLUMN ${campo} SET DEFAULT ${padrao}`
                console.log(sql)
                if(!await conn.SqlExecutar(sql))
                {
                    console.log("falha ao atualizar campo" + tabela + "." + campo)
                    return false
                }
                else{
                    if(alterou)
                        return true
                    else
                        return false
                }
            }
            else
            {
                return true
            }
        }
            
    } catch (error) {
            
    }        


}

async function EMPRESA(){ 
    try{    
        console.log("EMPRESA - Verificando")        
        let sql = "CREATE TABLE IF NOT EXISTS EMPRESA (\n"+
                    "ID int NOT NULL AUTO_INCREMENT,\n"+
                    "NOME varchar(100) NOT NULL,\n"+
                    "PRIMARY KEY (ID)\n"+
                    ");"; 
        if(!await conn.SqlExecutar(sql)) 
        return false

        if(!await VerificarCampo("EMPRESA","USUARIO","int(11)",null)) return false
        if(!await VerificarCampo("EMPRESA","CADASTRO","datetime",null)) return false
        if(!await VerificarCampo("EMPRESA","ATUALIZACAO","datetime",null)) return false
        if(!await VerificarCampo("EMPRESA","INATIVO","bit(1)",`b'0'`)) return false
        if(!await VerificarCampo("EMPRESA","PERFIL","int(11)",'0')) return false
        console.log("EMPRESA - Ok") 
    }
    catch(err){
        console.log(err)
    }
} 


async function EMPRESAUSUARIO(){ 
    try{    
        console.log("EMPRESAUSUARIO - Verificando")        
        let sql = "CREATE TABLE IF NOT EXISTS EMPRESAUSUARIO (\n"+
                    "EMPRESA_ID int NOT NULL,\n"+
                    "USUARIO_ID int NOT NULL,\n"+
                    "ADMIN bit NOT NULL,\n"+
                    "PRIMARY KEY (EMPRESA_ID,USUARIO_ID)\n"+
                    ");"; 
        if(!await conn.SqlExecutar(sql)) 
        return false
        if(!await VerificarCampo("EMPRESAUSUARIO","USUARIO","int(11)",null)) return false
        if(!await VerificarCampo("EMPRESAUSUARIO","CADASTRO","datetime",null)) return false
        if(!await VerificarCampo("EMPRESAUSUARIO","ATUALIZACAO","datetime",null)) return false
        if(!await VerificarCampo("EMPRESAUSUARIO","INATIVO","bit(1)",`b'0'`)) return false
        if(!await VerificarCampo("EMPRESAUSUARIO","RECUSOUEMPRESA","bit(1)",`b'0'`)) return false
        console.log("EMPRESAUSUARIO - Ok") 
    }
    catch(err){
        console.log(err)
    }
} 

async function USUARIO(){ 
    try{    
        console.log("USUARIO - Verificando")        
        let sql = "CREATE TABLE IF NOT EXISTS USUARIO (\n"+
                    "ID int NOT NULL AUTO_INCREMENT,\n"+
                    "EMAIL varchar(300) NOT NULL,\n"+
                    "SENHA varchar(200) NOT NULL,\n"+
                    "NOME varchar(200) NOT NULL,\n"+
                    "CPF_CNPJ char(14) NOT NULL,\n"+
                    "PRIMARY KEY (ID)\n"+
                    ");"; 
        if(!await conn.SqlExecutar(sql)) 
        return false

        if(!await VerificarCampo("USUARIO","EMAIL","varchar(300)",null)) return false
        if(!await VerificarCampo("USUARIO","SENHA","varchar(200)",null)) return false
        if(!await VerificarCampo("USUARIO","NOME","varchar(200)",null)) return false
        if(!await VerificarCampo("USUARIO","CPF_CNPJ","char(14)",null)) return false
        if(!await VerificarCampo("USUARIO","CADASTRO","datetime",null)) return false
        if(!await VerificarCampo("USUARIO","ATUALIZACAO","datetime",null)) return false
        if(!await VerificarCampo("USUARIO","INATIVO","bit(1)",`b'0'`)) return false



        
        const senha = await criptografia.encrypt("00121235440")
        sql = "SELECT ID FROM USUARIO WHERE EMAIL = 'gustavo@rtbusiness.com.br'"
        const UsuarioInicial = await conn.SqlVerificarSeExiste(sql);   
        if(!UsuarioInicial)
        {
            sql = `INSERT INTO USUARIO (EMAIL,SENHA,NOME,CPF_CNPJ,CADASTRO,ATUALIZACAO,INATIVO,PERFIL) 
            VALUES ('gustavo@rtbusiness.com.br','${senha.trim()}','Gustavo', '09335524751',now(),now(),0,0) `    
            
            if(!await conn.SqlExecutar(sql)) 
                return false
        }
        console.log("USUARIO - Ok")        
    }
    catch(err){
        console.log(err)
    }
} 

function CriarTabelas() {    
    USUARIO() 
    EMPRESA()  
    EMPRESAUSUARIO() 
}
//
module.exports = {CriarTabelas}