const Influx = require('influx')
const dotenv = require('dotenv')

dotenv.config();


exports.DB_name = 'medical'


exports.influx = new Influx.InfluxDB({
  host: process.env.INFLUXDB_URL,
  database: exports.DB_name,
})

// Create DB if not exists
exports.influx.getDatabaseNames()
.then(names => {
  if (!names.includes(exports.DB_name)) return exports.influx.createDatabase(exports.DB_name)
})
.catch(err => { console.error(`Error creating Influx database! ${err}`) })
