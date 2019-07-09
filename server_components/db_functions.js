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

var pushVote = function pushFunction(payload) {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO votes ( address, message, signature ) 
                    VALUES ('${payload.addr}','${payload.msg}','${payload.sig}')`, 
                    function (err, results) {
            if (err) reject(err);
            else {
                resolve('ok');
            }
        })
    })
}

var retrieveVotes = function retrieveFunction() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * 
                    FROM votes`, 
                    function (err, results) {
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
    pushVote,
}