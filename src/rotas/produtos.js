const express = require("express");
const router = express.Router();
const pool = require("../db");

// Obtenha todos os produtos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM produtos");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Obtenha um produto específico pelo seu identificador
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query("SELECT * FROM produtos WHERE id = $1", [
      id,
    ]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Adicione um novo produto
router.post("/", async (req, res) => {
  const { nome, preco } = req.body;

  try {
    const resultProduto = await pool.query(
      "INSERT INTO produtos (nome, preco) VALUES ($1, $2) RETURNING *",
      [nome, preco]
    );

    const id_produto = resultProduto.rows[0].id;

    await pool.query(
      "INSERT INTO estoque (id_produto, quantidade) VALUES ($1, 0)",
      [id_produto]
    );

    res.json(resultProduto.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Exclua um produto pelo seu identificador
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const produtoExistente = await pool.query(
      "SELECT * FROM produtos WHERE id = $1",
      [id]
    );

    if (produtoExistente.rows.length === 0) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    const vendasAssociadas = await pool.query(
      "SELECT * FROM vendas WHERE id_produto = $1",
      [id]
    );

    if (vendasAssociadas.rows.length > 0) {
      res.status(400).json({
        error:
          "Não é possível excluir o produto com vendas associadas. Considere desativá-lo.",
      });
      return;
    }

    await pool.query("DELETE FROM estoque WHERE id_produto = $1 RETURNING *", [
      id,
    ]);
    const result = await pool.query(
      "DELETE FROM produtos WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length > 0) {
      res.json({
        mensagem: "Produto removido com sucesso",
        produto: result.rows[0],
      });
    } else {
      res.status(500).json({ error: "Erro ao excluir o produto" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Atualize um produto pelo seu identificador
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { nome, preco } = req.body;

  try {
    const result = await pool.query(
      "UPDATE produtos SET nome = $1, preco = $2 WHERE id = $3 RETURNING *",
      [nome, preco, id]
    );

    if (result.rows.length > 0) {
      res.json({
        mensagem: "Produto atualizado com sucesso",
        produto: result.rows[0],
      });
    } else {
      res.status(404).json({ error: "Produto não encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
