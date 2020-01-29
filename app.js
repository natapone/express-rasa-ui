const express = require('express')
const cors = require('cors')
const favicon = require('serve-favicon')
const path = require('path')
const request = require('request');
const url = require('url');
const querystring = require('querystring');
const app = express()
const port = process.env.PORT || 3000;

app.use('/static', express.static('public'))
app.use('/ui', express.static('ui'))
app.use('/tmm', express.static('tmm'))
// app.use('/example', express.static('example'))

app.use(cors())
app.use(favicon(path.join(__dirname, 'public/image', 'favicon.ico')))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/json', function (req, res) {
  var params = {
    access_token : "",
    source : "",
    // foreign_id : "11111"
  }

  var dimeloUrl = "https://telenor.api.engagement.dimelo.com/1.0/contents";
  var urlReqAuth = dimeloUrl + "?" + querystring.stringify(params);

  console.log("Call = " + urlReqAuth);
  request(urlReqAuth, { json: true }, (err, response, body) => {
    if (err) { return console.log(err); }
    console.log(body);
  });

  res.send('Hello Json!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
