require('dotenv').config()

const config = {
  db:{
      host: process.env.HOST,
      password: process.env.PASS,
      user: process.env.USER,
      database: process.env.DB
  },
}

module.exports = {config}
