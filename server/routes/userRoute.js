const router = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/User')
const { userSchema } = require('../helpers/validateSchema')

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = await userSchema.validateAsync(req.body)

    // Generate hashed password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Generate new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })

    // Save user and return response
    const user = await newUser.save()
    res.status(201).json({
      msg: 'User registered successfully!',
      user
    })
  }
  catch (err) {
    res.status(err.statusCode || 500).json({
      errorMsg: err.message || 'Something went wrong!'
    })
  }
})

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    //find user
    const user = await User.findOne({ username });
    if (!user) {
      const error = new Error('Wrong username or password!');
      error.statusCode = 400;

      throw error;
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      const error = new Error('Wrong username or password!');
      error.statusCode = 400;

      throw error;
    }

    //send response
    res.status(200).json({
      msg: 'Login successful!',
      user
    });
  }
  catch (err) {
    res.status(err.statusCode || 500).json({
      errorMsg: err.message || 'Something went wrong!'
    })
  }

})

module.exports = router