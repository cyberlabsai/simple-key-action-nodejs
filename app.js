const express = require('express')
const app = express()
const PORT = 8281
const bodyParser = require('body-parser')
const fs = require('fs')
const cors = require('cors')
const localIp = require('ip').address()

// Configurando o Middleware Express
app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())

const createDataJson = () => {
  fs.writeFileSync('data.json', JSON.stringify({ data: [] }))
}

const getData = () => {
  try {
    const jsonData = require('./data.json')
    return jsonData
  } catch (err) {
    if (err.message.includes('data.json')) {
      createDataJson()
    }
  }
}

const writeData = obj => {
  try {
    const rawdata = fs.readFileSync('data.json')
    const users = JSON.parse(rawdata)
    users.data.push(obj)
    const data = JSON.stringify(users)
    fs.writeFileSync('data.json', data)
  } catch (err) {
    if (err.message.includes('data.json')) {
      createDataJson()
    }
  }
}

app.get('/local/:Portal', (req, res) => {
  const data = {
    portal: req.params.Portal,
    name: '',
    method: 'GET',
    dateTime: new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Recife'
    })
  }
  console.log(`Alguém acessou o portal ${req.params.Portal}!`)
  res.send(writeData(data))
})

// por padrão, a resposta do KeyApp é o nome do usuário no body.
app.post('/local/:Portal', (req, res) => {
  const data = {
    portal: req.params.Portal,
    name: req.body.name,
    method: 'POST',
    dateTime: new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Recife'
    })
  }
  console.log(`Usuário ${req.body.name} acessou o portal ${req.params.Portal}!`)
  res.send(writeData(data))
})

// Listando quem acessou o portal
app.get('/list', (req, res) => {
  res.json(getData())
})

app.listen(
  PORT,
  () => console.log(`No seu navegador acesse -> http://${localIp}:${PORT}\nURL -> POST ou GET -> http://${localIp}:${PORT}/local/NomeDoPortal\nListar os dados -> GET -> http://${localIp}:${PORT}/list`)
)
