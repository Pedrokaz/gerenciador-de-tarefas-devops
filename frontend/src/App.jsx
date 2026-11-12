
import { useState, useEffect } from 'react'
import api from './services/api'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    try {
      const response = await api.get('/tasks')
      setTasks(response.data)
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
    }
  }

  async function handleAddTask(event) {
    event.preventDefault()

    if (newTask.trim() === '') return

    try {
      const response = await api.post('/tasks', {
        title: newTask.trim()
      })

      setTasks([...tasks, response.data])
      setNewTask('')
      setShowForm(false)
    } catch (error) {
      console.error('Erro ao cadastrar tarefa:', error)
    }
  }

  async function toggleTask(id) {
    const task = tasks.find(task => task.id === id)

    try {
      const response = await api.put(`/tasks/${id}`, {
        completed: !task.completed
      })

      setTasks(tasks.map(item =>
        item.id === id ? response.data : item
      ))
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
    }
  }

  async function deleteTask(id) {
    try {
      await api.delete(`/tasks/${id}`)
      setTasks(tasks.filter(task => task.id !== id))
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error)
    }
  }

  async function editTask(task) {
    const newTitle = window.prompt('Edite o nome da tarefa:', task.title)

    if (newTitle === null || newTitle.trim() === '') return

    try {
      const response = await api.put(`/tasks/${task.id}`, {
        title: newTitle.trim()
      })

      setTasks(tasks.map(item =>
        item.id === task.id ? response.data : item
      ))
    } catch (error) {
      console.error('Erro ao editar tarefa:', error)
    }
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const pendingTasks = totalTasks - completedTasks

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Gerenciador de Tarefas</h1>
          <p>Organize suas tarefas em um só lugar.</p>
        </div>

        <button
          className="add-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Nova tarefa
        </button>
      </header>

      <main>
        <section className="dashboard">
          <h2>Visão geral</h2>

          <div className="stats">
            <div className="stat-card">
              <h3>Total de tarefas</h3>
              <span>{totalTasks}</span>
            </div>

            <div className="stat-card">
              <h3>Pendentes</h3>
              <span>{pendingTasks}</span>
            </div>

            <div className="stat-card">
              <h3>Concluídas</h3>
              <span>{completedTasks}</span>
            </div>
          </div>
        </section>

        {showForm && (
          <form onSubmit={handleAddTask} className="task-form">
            <input
              type="text"
              placeholder="Digite o nome da tarefa..."
              value={newTask}
              onChange={event => setNewTask(event.target.value)}
            />

            <button type="submit">Adicionar</button>
          </form>
        )}

        <section className="task-list">
          <h2>Minhas tarefas</h2>

          <div className="filters">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>

            <button
              className={filter === 'pending' ? 'active' : ''}
              onClick={() => setFilter('pending')}
            >
              Pendentes
            </button>

            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              Concluídas
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <p className="empty-message">
              {tasks.length === 0
                ? 'Nenhuma tarefa cadastrada.'
                : 'Nenhuma tarefa encontrada neste filtro.'}
            </p>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="task-item">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />

                <span className={task.completed ? 'completed' : ''}>
                  {task.title}
                </span>

                <button onClick={() => editTask(task)}>
                  Editar
                </button>

                <button onClick={() => deleteTask(task.id)}>
                  Excluir
                </button>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

export default App
