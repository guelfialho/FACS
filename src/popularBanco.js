const pool = require("./db");

class PopulaBanco {
  async popularBanco() {
    await this.adicionarClientes();
    await this.adicionarProdutos();
  }

  async adicionarClientes() {
    await pool.query(`
      INSERT INTO clientes (
        nome,
        email
      )
      VALUES
        ('Cliente1', 'cliente1@email.com'),
        ('Cliente2', 'cliente2@email.com'),
        ('Cliente3', 'cliente3@email.com'),
        ('Cliente4', 'cliente4@email.com'),
        ('Cliente5', 'cliente5@email.com');
    `);
    console.log("Clientes adicionados com sucesso");
    return;
  }

  async adicionarProdutos() {
    await pool.query(`
      INSERT INTO produtos (
        nome,
        preco
      )
      VALUES
        ('Maçã', 2.99),
        ('Banana', 1.99),
        ('Morango', 3.50),
        ('Abacaxi', 4.99),
        ('Pêssego', 3.75),
        ('Uva', 5.25),
        ('Tomate', 2.25),
        ('Cenoura', 1.75),
        ('Brócolis', 2.50),
        ('Abóbora', 3.99);
    `);
    console.log("Produtos adicionados com sucesso");
    return;
  }
}

const banco = new PopulaBanco();

banco.popularBanco();
