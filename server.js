'use strict';
require('dotenv').config()    // Access .env variables
const express = require('express');
const next = require('next');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { Pool, Client } = require('pg');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT;
const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    database: process.env.PG_DB,
    port: process.env.PG_PORT,
});

const app = next({ dev });
const serialize = data => JSON.stringify({ data });

var jwtFunctions = require('./server_components/jwt_functions');
var dbFunctions = require('./server_components/db_functions');

var payload = {};

var signOptions = {
    issuer: "dash_watch",
    subject: "poll1",
    audience: "dash-watch",
    expiresIn: "30d",    // 30 days validity  
    algorithm: "RS256",
};

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
                        Promise.resolve(dbFunctions.pushVote(payload)).then(function (response) {
                            res.status(200).send(response);
                        }).catch((error) => {                                               // Run this if the retrieving functions returns an error
                            console.log(error)
                            res.status(404).send(error)
                        })
                    });
                } else {
                    throw "Please use a POST request"
                }
            } catch (error) {
                console.log(error)
                res.status(404).send(error);
            }
        });

        // Retrieve votes from database
        server.get('/poll/view_votes', function (req, res) {
            let token = req.headers['x-access-token'] || req.headers['authorization'];      // Express headers are auto converted to lowercase            
            if (token) {
                if (token.startsWith('Bearer ')) {                                          // Remove Bearer from string if necessary             
                    token = token.slice(7, token.length);
                }
                var authorized = jwtFunctions.verify(token)
                if (authorized == true) {                                                   // Try retrieving data if the user is authorized is provided
                    Promise.resolve(dbFunctions.retrieveVotes()).then(function (voteData) {
                        res.status(200).end(serialize(voteData));
                    }).catch((error) => {                                               // Run this if the retrieving functions returns an error
                        console.log(error)
                        res.status(404).send('Token is valid but something went wrong retrieving the data')
                    })
                } else {                                                                    // Message if the retriever is not authorized
                    res.status(403).send('message: Please provide a valid token');
                }
            } else {                                                                        // If no auth token was provided at all
                res.status(403).send('message: Auth token not provided');
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