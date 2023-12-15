const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./db");
const cors = require("cors");
const clientesRotas = require("./rotas/clientes.js");
const produtosRotas = require("./rotas/produtos.js");

const app = express();
const port = 3333;

app.use(bodyParser.json());
app.use("/clientes", clientesRotas);
app.use("/produtos", produtosRotas);

app.use(
  cors({
    origin: "*",
  })
);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
