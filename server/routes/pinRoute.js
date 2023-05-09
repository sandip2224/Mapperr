const router = require('express').Router()
const Pin = require('../models/Pin')

// Create a pin
router.post('/', async (req, res) => {
  const newPin = new Pin(req.body)
  try {
    const savedPin = await newPin.save();
    res.status(201).json({
      msg: 'New pin successfully added!',
      pin: savedPin
    })
  }
  catch (err) {
    res.status(500).json({
      msg: 'Something went wrong!',
      errorMsg: err
    })
  }
})

// Get all pins
router.get('/', async (req, res) => {
  try {
    const pins = await Pin.find()
    res.status(200).json({
      msg: 'Fetched all pins successfully!',
      pins: pins
    })
  }
  catch (err) {
    res.status(500).json({
      msg: 'Something went wrong!',
      errorMsg: err
    })
  }
})

module.exports = router