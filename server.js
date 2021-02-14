const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const migration = require("./src/database/tabelas")
const login = require('./src/controllers/login')
const app  = express();
app.use(cors(
/* { origin: 'http://runtimebusiness-com-br.umbler.net/'} */
));
app.use(express.json());
app.get("/", (req, res) => {res.json({"status":"ok"})});
app.post("/login", login.verificarUsuario)
app.use(routes);
//migration.CriarTabelas()

app.listen(process.env.PORT || 8080,() => {
    console.log("Conectado porta 8080")
});



