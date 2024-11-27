const bcrypt = require('bcrypt')

// Replace 'your_plain_text_password' with the actual password you want to hash
const password = 'password'
const saltRounds = 10

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error('Error generating hash:', err)
    return
  }
  console.log('Generated hash:', hash)
  // Now, you can manually copy this hash to your seed.sql file
})
