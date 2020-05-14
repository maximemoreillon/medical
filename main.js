const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const Influx = require('influx')
const dotenv = require('dotenv')
const authorization_middleware = require('@moreillon/authorization_middleware')

dotenv.config();

var port = 80
if(process.env.APP_PORT) port=process.env.APP_PORT

const database_config = require('./database_config')
const weight_management = require('./weight_management')

// Set timezone
process.env.TZ = 'Asia/Tokyo';

authorization_middleware.authentication_api_url = `${process.env.AUTHENTIATION_API_URL}/decode_jwt`






var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(authorization_middleware.middleware);


// Express routes
app.post('/weight/upload',

})

app.post('/history', (req,res) => {
  influx.query(`select * from ${measurement_name}`)
  .then( result => res.send(result) )
  .catch( error => res.status(500).send(`Error getting weight from Influx: ${error}`) );
})

app.post('/current_weight', (req,res) => {

  influx.query(`select * from ${measurement_name} GROUP BY * ORDER BY DESC LIMIT 1`)
  .then( result => { res.send(result[0]) } )
  .catch( error => res.status(500).send(`Error getting weight from Influx: ${error}`) );
})


// start server
app.listen(port, () => {
  console.log(`[Express] Weight listening on *:${port}`)
})
