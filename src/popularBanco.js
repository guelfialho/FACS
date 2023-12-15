const pool = require("./db");

class PopulaBanco {
  async popularBanco() {
    await this.adicionarClientes();
    await this.adicionarProdutoEAtualizaEstoque("Maçã", 2.99);
    await this.adicionarProdutoEAtualizaEstoque("Banana", 1.99);
    await this.adicionarProdutoEAtualizaEstoque("Morango", 3.5);
    await this.adicionarProdutoEAtualizaEstoque("Abacaxi", 4.99);
    await this.adicionarProdutoEAtualizaEstoque("Pêssego", 3.75);
    await this.adicionarProdutoEAtualizaEstoque("Uva", 5.25);
    await this.adicionarProdutoEAtualizaEstoque("Tomate", 2.25);
    await this.adicionarProdutoEAtualizaEstoque("Cenoura", 1.75);
    await this.adicionarProdutoEAtualizaEstoque("Brócolis", 2.5);
    await this.adicionarProdutoEAtualizaEstoque("Abóbora", 3.99);
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

  async adicionarProdutoEAtualizaEstoque(nome, preco) {
    const resultProduto = await pool.query(
      "INSERT INTO produtos (nome, preco) VALUES ($1, $2) RETURNING *",
      [nome, preco]
    );

    const id_produto = resultProduto.rows[0].id;

    await pool.query(
      "INSERT INTO estoque (id_produto, quantidade) VALUES ($1, 0)",
      [id_produto]
    );

    console.log("Produto adicionado com sucesso");
    return;
  }
}

const banco = new PopulaBanco();

banco.popularBanco();
