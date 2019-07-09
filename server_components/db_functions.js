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
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM votes`, function (err, results) {
            if (err) reject(err);
            else {
                var objs = [];
                Object.values(results.rows).map((item) => {
                    objs.push({
                        address: item.address,
                        message: item.message,
                        signature: item.signature,
                    });
                })
                resolve(objs);
            }
        })
    })
}

module.exports = {
    retrieveVotes,
}