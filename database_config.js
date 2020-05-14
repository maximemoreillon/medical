const Influx = require('influx')
const dotenv = require('dotenv')

dotenv.config();


exports.DB_name = 'medical'
exports.weight_measurement = 'weight'
exports.blood_pressure_measurement = 'blood_pressure'


exports.influx = new Influx.InfluxDB({
  host: process.env.INFLUX_URL,
  database: DB_name,
})

// Create DB if not exists
influx.getDatabaseNames()
.then(names => {
  if (!names.includes(DB_name)) return influx.createDatabase(DB_name)
})
.catch(err => { console.error(`Error creating Influx database! ${err}`) })
