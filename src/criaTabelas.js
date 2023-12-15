const pool = require("./db");

class Tabelas {
  async criar() {
    await this.criaTabelaClientes();
    await this.criaTabelaProdutos();
  }
  async criaTabelaClientes() {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS clientes (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(50) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL
            );
        `);
    console.log("Tabela clientes criada com sucesso");
    return;
  }

  async criaTabelaProdutos() {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(50) NOT NULL,
                preco NUMERIC(10,2) NOT NULL
            );
        `);
    console.log("Tabela produtos criada com sucesso");
    return;
  }
}

const tabelas = new Tabelas();

tabelas.criar();
