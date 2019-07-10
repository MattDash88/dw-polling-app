'use strict';
require('dotenv').config()    // Access .env variables
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT;

const app = next({ dev });
const serialize = data => JSON.stringify({ data });

var jwtFunctions = require('./server_components/jwt_functions');
var dbFunctions = require('./server_components/db_functions');
var errorFunctions = require('./server_components/error_handling');

var payload = {};

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
                        var database = 'votes'
                        Promise.resolve(dbFunctions.pushVote(payload, database)).then(function (response) {
                            res.status(200).send(response);
                        }).catch((error) => {                                               // Run this if the retrieving functions returns an error
                            res.status(404).send(error)
                        })
                    });
                } else {
                    throw "Please use a POST request"
                }
            } catch (error) {
                res.status(404).send(error);
            }
        });

        // Retrieve votes from database
        server.get('/poll/view_votes', function (req, res) {
            let token = req.headers['x-access-token'] || req.headers['authorization'];      // Express headers are auto converted to lowercase            
            let database = req.query.db
            if (token && database) {
                if (token.startsWith('Bearer ')) {                                          // Remove Bearer from string if necessary             
                    token = token.slice(7, token.length);
                }
                var authorization = jwtFunctions.verify(token, database)
                if (authorization == 'success') {                                                   // Try retrieving data if the user is authorized is provided
                    Promise.resolve(dbFunctions.retrieveVotes(database)).then(function (voteData) {
                        res.status(200).end(serialize(voteData));
                    }).catch((error) => {                                               // Run this if the retrieving functions returns an error
                        res.status(404).send('Token is valid but something went wrong retrieving the data')
                    })
                } else {  
                    var errorMessage = errorFunctions.authenticationErrors(authorization)                                                                  // Message if the retriever is not authorized
                    res.status(403).send(`message: ${errorMessage}`);
                }
            } else if (!token) {                                                                        // If no auth token was provided at all
                res.status(403).send('message: Auth token not provided');
            } else if (!database) {                                                                        // If no auth token was provided at all
                res.status(403).send('message: Please provide a database you want to access');
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