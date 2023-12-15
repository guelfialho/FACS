const express = require("express");
const router = express.Router();
const pool = require("../db");

//busca todos os clientes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clientes");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

//busca um cliente especifico pelo seu identificador
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(`SELECT * FROM clientes WHERE id = ${id}`);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Adiciona um novo cliente
router.post("/", async (req, res) => {
  const { nome, email } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO clientes (nome, email) VALUES ($1, $2) RETURNING *",
      [nome, email]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Verificar se o cliente existe
    const clienteExistente = await pool.query(
      "SELECT * FROM clientes WHERE id = $1",
      [id]
    );

    if (clienteExistente.rows.length === 0) {
      res.status(404).json({ error: "Cliente não encontrado" });
      return;
    }

    // Verificar se há vendas associadas ao cliente
    const vendasAssociadas = await pool.query(
      "SELECT * FROM vendas WHERE id_cliente = $1",
      [id]
    );

    // Se houver vendas associadas, informe que não é possível excluir o cliente
    if (vendasAssociadas.rows.length > 0) {
      res
        .status(400)
        .json({
          error:
            "Não é possível excluir o cliente com vendas associadas. Considere desativá-lo.",
        });
      return;
    }

    // Se não houver vendas associadas, exclua o cliente
    const result = await pool.query(
      "DELETE FROM clientes WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length > 0) {
      res.json({
        mensagem: "Cliente removido com sucesso",
        cliente: result.rows[0],
      });
    } else {
      res.status(500).json({ error: "Erro ao excluir o cliente" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { nome, email } = req.body;

  try {
    const result = await pool.query(
      "UPDATE clientes SET nome = $1, email = $2 WHERE id = $3 RETURNING *",
      [nome, email, id]
    );

    if (result.rows.length > 0) {
      res.json({
        mensagem: "Cliente atualizado com sucesso",
        cliente: result.rows[0],
      });
    } else {
      res.status(404).json({ error: "cliente não encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
