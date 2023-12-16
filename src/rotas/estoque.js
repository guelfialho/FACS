const express = require("express");
const router = express.Router();
const pool = require("../db");

router.put("/:id_produto", async (req, res) => {
  const id_produto = req.params.id_produto;
  const { quantidade } = req.body;

  try {
    const resultEstoque = await pool.query(
      "UPDATE estoque SET quantidade = $1 WHERE id_produto = $2 RETURNING *",
      [quantidade, id_produto]
    );

    if (resultEstoque.rows.length > 0) {
      res.json({
        mensagem: "Quantidade de estoque atualizada com sucesso",
        estoque: resultEstoque.rows[0],
      });
    } else {
      res.status(404).json({ error: "Produto não encontrado no estoque" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.get("/", async (req, res) => {
  try {
    const resultEstoque = await pool.query("SELECT * FROM estoque");

    res.json({
      produtos: resultEstoque.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para buscar um produto específico no estoque
router.get("/:id_produto", async (req, res) => {
  const id_produto = req.params.id_produto;

  try {
    const resultEstoque = await pool.query(
      "SELECT * FROM estoque WHERE id_produto = $1",
      [id_produto]
    );

    if (resultEstoque.rows.length > 0) {
      res.json({
        produto: resultEstoque.rows[0],
      });
    } else {
      res.status(404).json({ error: "Produto não encontrado no estoque" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
