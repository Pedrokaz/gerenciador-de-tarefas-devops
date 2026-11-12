
const express = require('express')
const router = express.Router()
const pool = require('../config/database')

// Listar tarefas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY id ASC'
    )

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao listar tarefas.' })
  }
})

// Criar tarefa
router.post('/', async (req, res) => {
  try {
    const { title } = req.body

    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        message: 'O título da tarefa é obrigatório.'
      })
    }

    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title.trim()]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao cadastrar tarefa.' })
  }
})

// Atualizar tarefa
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { title, completed } = req.body

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: 'ID inválido.'
      })
    }

    if (title === undefined && completed === undefined) {
      return res.status(400).json({
        message: 'Informe algum dado para atualizar.'
      })
    }

    if (title !== undefined &&
        (typeof title !== 'string' || !title.trim())) {
      return res.status(400).json({
        message: 'O título não pode ser vazio.'
      })
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({
        message: 'O status deve ser verdadeiro ou falso.'
      })
    }

    const current = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    )

    if (current.rows.length === 0) {
      return res.status(404).json({
        message: 'Tarefa não encontrada.'
      })
    }

    const task = current.rows[0]

    const newTitle = title !== undefined ? title.trim() : task.title
    const newCompleted = completed !== undefined ? completed : task.completed

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1, completed = $2
       WHERE id = $3
       RETURNING *`,
      [newTitle, newCompleted, id]
    )

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao atualizar tarefa.' })
  }
})

// Excluir tarefa
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: 'ID inválido.'
      })
    }

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Tarefa não encontrada.'
      })
    }

    res.json({
      message: 'Tarefa excluída com sucesso.'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao excluir tarefa.' })
  }
})

module.exports = router
