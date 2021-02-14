const jwt = require('jsonwebtoken');
const authConfig = require('../auth/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send({ erro: "Token não fornecido." });
    
    const parts = authHeader.split(' ');

    if (!parts.length === 2)
        return res.status(401).send({ erro: "Erro no envio do token." });

    const [ scheme, token ] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ erro: "Token mal formatado. Pode ser que você não tenha enviado o Bearer no início do Authorization." });
    
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err)
            return res.status(401).send({ erro: "Token inválido." });

        //console.log(decoded)    
        req.decoded = decoded; 
        return next();
    });
};