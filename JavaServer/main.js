const express = require('express')
const app = express()

app.use(express.json())
app.post('/javaurl', async (req, res) => {    
    console.log(req.body)
    res.status(200).send()
})

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
    console.log(`Java server is listening on port ${PORT}`)    
})