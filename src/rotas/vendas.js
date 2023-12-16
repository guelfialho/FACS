const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { id_produto, id_cliente, quantidade } = req.body;

  try {
    // Verifique se a quantidade no estoque é suficiente
    const resultEstoque = await pool.query(
      "SELECT quantidade FROM estoque WHERE id_produto = $1",
      [id_produto]
    );

    if (
      resultEstoque.rows.length === 0 ||
      resultEstoque.rows[0].quantidade < quantidade
    ) {
      res.status(400).json({ error: "Quantidade insuficiente em estoque" });
      return;
    }

    // Obtenha o preço do produto
    const resultProduto = await pool.query(
      "SELECT preco FROM produtos WHERE id = $1",
      [id_produto]
    );

    const preco = resultProduto.rows[0].preco;

    // Atualize a quantidade no estoque após a venda
    await pool.query(
      "UPDATE estoque SET quantidade = quantidade - $1 WHERE id_produto = $2",
      [quantidade, id_produto]
    );

    // Registre a venda
    const valor_total = quantidade * preco;
    const resultVenda = await pool.query(
      "INSERT INTO vendas (id_produto, id_cliente, quantidade, valor_total) VALUES ($1, $2, $3, $4) RETURNING *",
      [id_produto, id_cliente, quantidade, valor_total]
    );

    res.json(resultVenda.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para obter todas as vendas
router.get("/", async (req, res) => {
  try {
    const resultVendas = await pool.query("SELECT * FROM vendas");
    res.json(resultVendas.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para obter um relatório de produtos mais vendidos
router.get("/relatorio-mais-vendidos", async (req, res) => {
  try {
    const query = `
      SELECT
        p.nome as produto,
        SUM(v.quantidade) as quantidade_vendida
      FROM
        produtos p
      JOIN
        vendas v ON p.id = v.id_produto
      GROUP BY
        p.id
      ORDER BY
        quantidade_vendida DESC;
    `;

    const resultRelatorio = await pool.query(query);
    res.json(resultRelatorio.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para obter um relatório de produtos vendidos por cliente
router.get("/relatorio-vendas-por-cliente", async (req, res) => {
  try {
    const query = `
      SELECT
        c.nome as cliente,
        p.nome as produto,
        SUM(v.quantidade) as quantidade_total_vendida,
        SUM(v.valor_total) as valor_total_vendas
      FROM
        clientes c
      JOIN
        vendas v ON c.id = v.id_cliente
      JOIN
        produtos p ON v.id_produto = p.id
      GROUP BY
        c.nome, p.nome
      ORDER BY
        c.nome, p.nome;
    `;

    const resultRelatorio = await pool.query(query);
    res.json(resultRelatorio.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para obter um relatório de consumo médio do cliente
router.get("/relatorio-consumo-medio-cliente", async (req, res) => {
  try {
    const query = `
      SELECT
        c.nome as cliente,
        COALESCE(ROUND(AVG(v.valor_total), 2), 0) as consumo_medio,
        COALESCE(ROUND(SUM(v.valor_total), 2), 0) as valor_total_consumido,
        COALESCE(COUNT(v.id), 0) as quantidade_total_compras
      FROM
        clientes c
      LEFT JOIN
        vendas v ON c.id = v.id_cliente
      GROUP BY
        c.nome
      ORDER BY
        cliente;
    `;

    const resultRelatorio = await pool.query(query);
    res.json(resultRelatorio.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para obter um relatório de produtos com status de estoque
router.get("/relatorio-estoque-status", async (req, res) => {
  try {
    const estoqueLimiteBaixo = 2;

    const query = `
      SELECT
        p.nome as produto,
        e.quantidade as quantidade_em_estoque,
        CASE
          WHEN e.quantidade < $1 THEN 'Baixo'
          WHEN e.quantidade = $1 THEN 'No Limite'
          ELSE 'Normal'
        END as status_estoque
      FROM
        produtos p
      LEFT JOIN
        estoque e ON p.id = e.id_produto
      ORDER BY
        p.nome;
    `;

    const resultRelatorio = await pool.query(query, [estoqueLimiteBaixo]);
    res.json(resultRelatorio.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
