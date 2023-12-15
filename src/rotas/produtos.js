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
    const result = await pool.query(
      "INSERT INTO produtos (nome, preco) VALUES ($1, $2) RETURNING *",
      [nome, preco]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Exclua um produto pelo seu identificador
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
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
      res.status(404).json({ error: "Produto não encontrado" });
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
