const database_config = require('./database_config.js')

exports.weight_upload = (req,res) => {
  console.log('[Express] request arrived on /upload')

  if( !('weight' in req.body) ) return res.status(400).send('weight is not present in request body')

  database_config.influx.writePoints([{
    measurement: measurement_name,
    tags: {
      unit: 'kg',
    },
    fields: {
      weight: Number(req.body.weight)
    },
    timestamp: new Date(),
  }], {
    database: DB_name,
    precision: 's',
  })
  .then( () => res.send("Weight registered successfully"))
  .catch(error => {
    console.log(error)
    res.status(500).send(`Error saving data to InfluxDB! ${error}`)
  })
}
