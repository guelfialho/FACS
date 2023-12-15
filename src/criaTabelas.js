const pool = require("./db");

class Tabelas {
  async criar() {
    await this.criaTabelaClientes();
    await this.criaTabelaProdutos();
    await this.criaTabelaEstoque();
    await this.criaTabelaVendas();
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

  async criaTabelaEstoque() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS estoque (
        id_produto INTEGER REFERENCES produtos(id),
        quantidade INTEGER DEFAULT 0
      );
        `);
    console.log("Tabela estoque criada com sucesso");
    return;
  }

  async criaTabelaVendas() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vendas (
        id SERIAL PRIMARY KEY,
        id_produto INTEGER REFERENCES produtos(id),
        id_cliente INTEGER REFERENCES clientes(id),
        quantidade INTEGER NOT NULL,
        valor_total NUMERIC(10,2) NOT NULL,
        data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
        `);
    console.log("Tabela vendas criada com sucesso");
    return;
  }
}

const tabelas = new Tabelas();

tabelas.criar();
