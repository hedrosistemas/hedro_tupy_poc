const express = require('express')
const app = express()

const postBackController = require('./controller/post.controller')

app.use(express.json())
app.post('/tupyurl', postBackController)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
