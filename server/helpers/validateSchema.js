const Joi = require('joi')

const userSchema = Joi.object({
  username: Joi.string().required().min(3).max(20),
  email: Joi.string().email().required().max(50),
  password: Joi.string().required().min(6)
})

module.exports = {
  userSchema
}