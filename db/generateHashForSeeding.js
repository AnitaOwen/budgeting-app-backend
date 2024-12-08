const bcrypt = require('bcrypt')

const password = 'password'
const saltRounds = 10

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error('Error generating hash:', err)
    return
  }
  console.log('Generated hash:', hash)
})
