require('dotenv').config()    // Access .env variables
const express = require('express')
const next = require('next')
const { Pool, Client } = require('pg');

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT
const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    database: process.env.PG_DB,
    port: process.env.PG_PORT,
});

const app = next({ dev })
const serialize = data => JSON.stringify({ data })


app.prepare()
    .then(() => {
        const server = express()

        // Submit the vote
        server.post('/poll/vote', function (req, res) {
            try {
                if (req.method === 'POST') {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });
                    req.on('end', () => {
                        var payload = JSON.parse(body)
                        pool.query(`INSERT INTO votes ( address, message, signature ) VALUES ('${payload.addr}','${payload.msg}','${payload.sig}')`, function (err, result) {
                            if (err) throw err;
                        })

                        res.end('ok');
                    });
                } else {
                    throw "Please use a POST request"
                }
            } catch (error) {
                console.log(error)
                res.end(error);
            }
        });
        
        // Retrieve votes from database
        server.get('/poll/view_votes', function (req, res) {
            try {
                pool.query(`SELECT * FROM votes`, function (err, result) {
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
                    res.end(serialize(objs));
                })
            } catch (error) {
                console.log(error)
                res.end(error);
            }
        })

        // Routing to main page
        server.get('*', (req, res) => {
            const actualPage = '/index'
            const queryParams = '' // Pass on queries

            app.render(req, res, actualPage, queryParams)
        })

        server.listen(port, (err) => {
            if (err) throw err
        })
    }).catch((ex) => {
        //console.error(ex.stack)
        process.exit(1)
})