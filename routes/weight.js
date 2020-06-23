const express = require('express')
const database_config = require('../database_config.js')

const router = express.Router()

const measurement_name = 'weight'


let register_weight = (req,res) => {

  if( !('weight' in req.body) ) return res.status(400).send('weight is not present in request body')

  database_config.influx.writePoints([{
    measurement: measurement_name,
    tags: { unit: 'kg'},
    fields: { weight: Number(req.body.weight) },
    timestamp: new Date(),
  }], {
    database: database_config.DB_name,
    precision: 's',
  })
  .then( () => res.send("Weight registered successfully"))
  .catch(error => {
    console.log(error)
    res.status(500).send(`Error saving data to InfluxDB! ${error}`)
  })
}

let get_weight_history = (req,res) => {
  database_config.influx.query(`select * from ${measurement_name}`)
  .then( result => res.send(result) )
  .catch( error => {
    console.log(error)
    res.status(500).send(`Error getting weight from Influx: ${error}`)
  })
}

let get_current_weight = (req,res) => {
  database_config.influx.query(`select * from ${measurement_name} GROUP BY * ORDER BY DESC LIMIT 1`)
  .then( result => { res.send(result[0]) } )
  .catch( error => {
    console.log(error)
    res.status(500).send(`Error getting weight from Influx: ${error}`)
  })
}

router.route('/')
  .post(register_weight)
router.route('/current')
  .get(get_current_weight)
router.route('/history')
  .get(get_weight_history)

module.exports = router
