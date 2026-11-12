
jest.mock('../config/database', () => ({
  query: jest.fn()
}))

const request = require('supertest')
const app = require('../server')
const pool = require('../config/database')

afterEach(() => {
  jest.clearAllMocks()
})

describe('Testes da API de tarefas', () => {
  test('GET /tasks deve listar as tarefas', async () => {
    pool.query.mockResolvedValue({
      rows: [
        { id: 1, title: 'Estudar DevOps', completed: false }
      ]
    })

    const response = await request(app).get('/tasks')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(response.body[0].title).toBe('Estudar DevOps')
  })

  test('POST /tasks deve cadastrar uma tarefa', async () => {
    pool.query.mockResolvedValue({
      rows: [
        { id: 2, title: 'Estudar React', completed: false }
      ]
    })

    const response = await request(app)
      .post('/tasks')
      .send({ title: 'Estudar React' })

    expect(response.status).toBe(201)
    expect(response.body.title).toBe('Estudar React')
  })

  test('POST /tasks não deve aceitar título vazio', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({ title: '   ' })

    expect(response.status).toBe(400)
  })

  test('PUT /tasks/:id deve atualizar uma tarefa', async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [
          { id: 1, title: 'Estudar DevOps', completed: false }
        ]
      })
      .mockResolvedValueOnce({
        rows: [
          { id: 1, title: 'Estudar DevOps', completed: true }
        ]
      })

    const response = await request(app)
      .put('/tasks/1')
      .send({ completed: true })

    expect(response.status).toBe(200)
    expect(response.body.completed).toBe(true)
  })

  test('DELETE /tasks/:id deve excluir uma tarefa', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 1 }]
    })

    const response = await request(app).delete('/tasks/1')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Tarefa excluída com sucesso.')
  })
})
