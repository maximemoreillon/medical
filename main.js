const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const dotenv = require('dotenv')
const authorization_middleware = require('@moreillon/authorization_middleware')

dotenv.config();

var port = 80
if(process.env.APP_PORT) port=process.env.APP_PORT

const database_config = require('./database_config')
const weight_management = require('./weight_management')
const blood_pressure_management = require('./blood_pressure_management')

// Set timezone
process.env.TZ = 'Asia/Tokyo';

authorization_middleware.authentication_api_url = `${process.env.AUTHENTIATION_API_URL}/decode_jwt`

var app = express();
app.use(bodyParser.json());
app.use(cors());
//app.use(authorization_middleware.middleware);


// Express routes
app.get('/', (req, res) => { res.send('Medical API v1.0.0, Maxime MOREILLON') })
app.get('/db_url', (req, res) => { res.send(process.env.INFLUXDB_URL) })

// Weight related routes
app.post('/weight/register', weight_management.register_weight)
app.get('/weight/history', weight_management.get_weight_history)
app.get('/weight/current', weight_management.get_current_weight)

app.post('/blood_pressure/register', blood_pressure_management.register_blood_pressure)
app.get('/blood_pressure/history', blood_pressure_management.get_blood_pressure_history)
app.get('/blood_pressure/current', blood_pressure_management.get_current_blood_pressure)

// start server
app.listen(port, () => { console.log(`[Express] Medical listening on *:${port}`)})
