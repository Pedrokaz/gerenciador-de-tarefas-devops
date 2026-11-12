const express = require('express')
const cors = require('cors')
require('dotenv').config()

const taskRoutes = require('./routes/taskRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'API do Gerenciador de Tarefas funcionando!'
  })
})

app.use('/tasks', taskRoutes)

if (require.main === module) {
  const PORT = process.env.PORT || 3000

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
  })
}

module.exports = app