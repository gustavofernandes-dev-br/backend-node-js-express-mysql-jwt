const mysql = require('mysql');

//umbler
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'gustavonsantos1983',
  password : '00121235440',
  database : 'rtbusiness',

  typeCast: function castField( field, useDefaultTypeCasting ) {

    // We only want to cast bit fields that have a single-bit in them. If the field
    // has more than one bit, then we cannot assume it is supposed to be a Boolean.
    if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
        var bytes = field.buffer();
        // A Buffer in Node represents a collection of 8-bit unsigned integers.
        // Therefore, our single "bit field" comes back as the bits '0000 0001',
        // which is equivalent to the number 1.
        return( bytes[ 0 ] === 1 );
    }
    return( useDefaultTypeCasting() );

}
});

//google
var connection2 = mysql.createConnection({
    host     : '35.192.144.39',
    user     : 'root',
    password : 'Amotamires123',
    database : 'run-time-business'
  });
//
function to (promise) {
    return promise
        .then(val => [null, val])
        .catch(err => [err]);
}

function SqlExecutar(sql,objeto)
{
    return new Promise((resolve,reject) => {
        
        connection.query(sql,objeto, (error, rows, fields) => { 
            if (error) {
                console.log(error)
                reject(false);
            } else {    
                //console.log(sql)
                resolve(true);
            }
        });


    })
}

function SqlPegarCampos(sql,objeto){
    return new Promise((resolve,reject)=>{ 
      connection.query(sql,objeto, (error, rows, fields) => { 
        if (error) {
            console.log(error)
            reject(false);
        } else {
          resolve(rows);
        }
      });
    });
}

function SqlVerificarSeExiste(sql,objeto){
    return new Promise((resolve,reject)=>{ 
      connection.query(sql, objeto, (error, rows, fields) => { 
        if (error) {
            console.log(error)
            reject(false);
        } else {
            resolve(rows.length >= 1 ? true : false);
        }
      });
    });
}


/*

    conn.SqlExecutar(sql).then(
        (val) => {            
            console.log(val);
        }
    ).catch(
        err => {
            console.log([err])
        }
    )

    let [err, retorno] = await conn.to(conn.SqlExecutar(sql))
    if (err)
    {
        console.log(err)

    }
    else
    {
        console.log(retorno)
    }
function execSQLQuery(sqlQry, res){
    global.conn.request()
              .query(sqlQry)
              .then(result => res.json(result.recordset))
               .catch(err => res.json(err));
}

 let [err2,res] = await conn.to(conn.SqlVerificarSeExiste(sql));
    if (err2) {
        console.log("encountered err",err2);
    }
    else{
        console.log(res)
        if(retorno == 0)
        {
            sql = `INSERT INTO USUARIO (EMAIL,SENHA,NOME,CPF_CNPJ) 
            VALUES ('gustavo@rtbusiness.com.br','${senha.trim()}','Gustavo', '09335524751' ) `    
            await conn.SqlExecutar(sql)
        }
    }
*/
module.exports = {SqlExecutar,SqlVerificarSeExiste,to,SqlPegarCampos}