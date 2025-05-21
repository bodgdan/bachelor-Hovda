const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    password: 'uri200306',
    host: 'localhost',
    port: 5432,
    database: 'bohdan'
})


module.exports = pool