const express = require('express');
const rotas = require('./rotas');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(rotas);

console.log("Servidor Iniciado!!!"); 

app.listen(8000);