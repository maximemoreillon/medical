const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const dotenv = require('dotenv')
const authorization_middleware = require('@moreillon/authorization_middleware')

dotenv.config()


const port = process.env.APP_PORT || 80



// Set timezone
process.env.TZ = 'Asia/Tokyo';

authorization_middleware.authentication_api_url = `${process.env.AUTHENTIATION_API_URL}/decode_jwt`

const app = express()
app.use(bodyParser.json())
app.use(cors())
//app.use(authorization_middleware.middleware);

// Express routes
app.get('/', (req, res) => { res.send('Medical API v1.0.0, Maxime MOREILLON') })

app.use('/weight', require('./routes/weight'))
app.use('/blood_pressure', require('./routes/blood_pressure'))
app.use('/blood_sugar', require('./routes/blood_sugar'))

// start server
app.listen(port, () => { console.log(`[Express] Medical listening on *:${port}`)})
