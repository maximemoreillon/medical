const express = require('express')
const database_config = require('../database_config.js')

const router = express.Router()

const measurement_name = 'blood_pressure'

let register_blood_pressure = (req,res) => {

  // Input sanitation
  if( !('systolic_pressure' in req.body) ) return res.status(400).send('systolic_pressure is not present in request body')
  if( !('diastolic_pressure' in req.body) ) return res.status(400).send('diastolic_pressure is not present in request body')

  database_config.influx.writePoints([{
    measurement: measurement_name,
    tags: {
      unit: 'mmHg',
    },
    fields: {
      systolic_pressure: Number(req.body.systolic_pressure),
      diastolic_pressure: Number(req.body.diastolic_pressure)
    },
    timestamp: new Date(),
  }], {
    database: database_config.DB_name,
    precision: 's',
  })
  .then( () => res.send("Blood pressure registered successfully"))
  .catch(error => {
    console.log(error)
    res.status(500).send(`Error saving data to InfluxDB! ${error}`)
  })
}

let get_blood_pressure_history = (req,res) => {
  database_config.influx.query(`select * from ${measurement_name}`)
  .then( result => res.send(result) )
  .catch( error => res.status(500).send(`Error getting weight from Influx: ${error}`) )
}

let get_current_blood_pressure = (req,res) => {
  database_config.influx.query(`select * from ${measurement_name} GROUP BY * ORDER BY DESC LIMIT 1`)
  .then( result => { res.send(result[0]) } )
  .catch( error => res.status(500).send(`Error getting weight from Influx: ${error}`) )
}

router.route('/')
  .post(register_blood_pressure)
router.route('/current')
  .get(get_current_blood_pressure)
router.route('/history')
  .get(get_blood_pressure_history)

module.exports = router
