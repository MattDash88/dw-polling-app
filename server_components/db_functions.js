require('dotenv').config()    // Access .env variables
const { Pool, Client } = require('pg');
const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    database: process.env.PG_DB,
    port: process.env.PG_PORT,
});

var retrieveVotes = function retrieveFunction() {
    try {
        votes = pool.query(`SELECT * FROM votes`, function (err, result) {
            if (err) throw err;
            var objs = []
            //console.log(result.rows)
            Object.values(result.rows).map((item) => {
                objs.push({
                    address: item.address,
                    message: item.message,
                    signature: item.signature,
                })
            })
            //console.log(objs)
            return objs            
        })
        console.log(votes)
    } catch (error) {
        console.log(error)
        return 'test';
    }
}

module.exports = {
    retrieveVotes,
}