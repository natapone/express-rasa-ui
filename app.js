const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;

app.use('/static', express.static('public'))
app.use('/ui', express.static('ui'))
app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
