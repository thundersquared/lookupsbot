const path = require('path')
const fs   = require('fs')

const config = {
  mysql: {
    host: null,
    database: null,
    user: null,
    password: null
  },
  telegram: {
    username: null,
    token: null
  }
}

const envConfFile = path.resolve(__dirname, `config.${process.env.NODE_ENV}.js`)

if (process.env.NODE_ENV && fs.existsSync(envConfFile)) {
  Object.assign(config, require(envConfFile))
}

module.exports = config
