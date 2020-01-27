const express = require('express')
const cors = require('cors')
const favicon = require('serve-favicon')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000;

app.use('/static', express.static('public'))
app.use('/ui', express.static('ui'))
app.use('/tmm', express.static('tmm'))
// app.use('/example', express.static('example'))

app.use(cors())
app.use(favicon(path.join(__dirname, 'public/image', 'favicon.ico')))

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
