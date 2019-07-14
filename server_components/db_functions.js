require('dotenv').config()    // Access .env variables
const fs = require('fs');
const { Pool, Client } = require('pg');
const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    database: process.env.PG_DB,
    port: process.env.PG_PORT,
    ssl: {
        rejectUnauthorized : false,
        ca   : fs.readFileSync("./server-ca.pem").toString(),
        key  : fs.readFileSync("./client-key.pem").toString(),
        cert : fs.readFileSync("./client-cert.pem").toString(),
  },
});

var pushVote = function pushFunction(db, msg, addr, sig) {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO ${db} ( address, message, signature ) 
                    VALUES ('${addr}','${msg}','${sig}')`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                resolve('success');
            }
        })
    })
}

var retrieveVotes = function retrieveFunction(database) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM ${database}`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                var objs = [];

                // Get timestamp
                var today = new Date()
                var date = today.getUTCFullYear()+'-'+(today.getUTCMonth()+1)+'-'+today.getUTCDate();
                var time = today.getUTCHours() + ":" + today.getUTCMinutes() + ":" + today.getUTCSeconds();
                var dateTime = date+' '+time;
                Object.values(results.rows).map((item) => {
                    objs.push({
                        db: 'votes',
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
    pushVote,
}