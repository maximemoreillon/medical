const express = require('express')
const database_config = require('../database_config.js')

const router = express.Router()

const measurement_name = 'blood_sugar'

let register_blood_sugar = (req,res) => {

  // Input sanitation
  if( !('blood_sugar' in req.body) ) return res.status(400).send('blood_sugar is not present in request body')

  database_config.influx.writePoints([{
    measurement: measurement_name,
    tags: {
      unit: 'mmHg',
    },
    fields: {
      blood_sugar: Number(req.body.blood_sugar),
    },
    timestamp: new Date(),
  }], {
    database: database_config.DB_name,
    precision: 's',
  })
  .then( () => res.send("Blood sugar registered successfully"))
  .catch(error => {
    console.log(error)
    res.status(500).send(`Error saving data to InfluxDB! ${error}`)
  })
}

let get_blood_sugar_history = (req,res) => {
  database_config.influx.query(`select * from ${measurement_name}`)
  .then( result => res.send(result) )
  .catch( error => res.status(500).send(`Error getting weight from Influx: ${error}`) )
}

let get_current_blood_sugar = (req,res) => {
  database_config.influx.query(`select * from ${measurement_name} GROUP BY * ORDER BY DESC LIMIT 1`)
  .then( result => { res.send(result[0]) } )
  .catch( error => res.status(500).send(`Error getting weight from Influx: ${error}`) )
}

router.route('/')
  .post(register_blood_sugar)
router.route('/current')
  .get(get_current_blood_sugar)
router.route('/history')
  .get(get_blood_sugar_history)

module.exports = router
