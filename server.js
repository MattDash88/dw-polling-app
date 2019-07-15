'use strict';
require('dotenv').config()    // Access .env variables
const express = require('express');
const next = require('next');
const { join } = require('path')
const dashcore = require('@dashevo/dashcore-lib');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT;

const app = next({ dev });
const serialize = data => JSON.stringify({ data });

var jwtFunctions = require('./server_components/jwt_functions');
var dbFunctions = require('./server_components/db_functions');
var errorFunctions = require('./server_components/error_handling');

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
                        // All three attributes must be provided
                        if (typeof payload.db == 'undefined' || typeof payload.addr == 'undefined' || typeof payload.msg == 'undefined' || typeof payload.sig == 'undefined') {
                            var returnObject = errorFunctions.submitVoteErrors('form incomplete')
                            res.status(400).send(returnObject);
                        } else {
                            const { db, msg, addr, sig, } = payload
                            var message = dashcore.Message(msg);        // Convert message to the right syntax
                            const isValidAddress = dashcore.Address.isValid(addr, 'mainnet');
                            const isValidSig = errorFunctions.verifySig(message, addr, sig)
                            if (!isValidAddress) {
                                var returnObject = errorFunctions.submitVoteErrors('invalid address')
                                res.status(400).send(returnObject);
                            } else if (!isValidSig) { 
                                var returnObject = errorFunctions.submitVoteErrors('invalid signature')
                                res.status(400).send(returnObject);
                            } else {                                
                                Promise.resolve(dbFunctions.submitVote(db, msg, addr, sig)).then(function (response) {
                                    var returnString = `Vote recorded - ${msg} using address ${addr}`;
                                    res.status(200).send(returnString);
                                }).catch((error) => {                                               // Run this if the retrieving functions returns an error
                                    var returnObject = errorFunctions.submitVoteErrors('submission error')
                                    res.status(500).send(returnObject);
                                })
                            }
                        }
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
            let database = req.query.db                                                     // A query for the database that is accessed is required 
            if (token && database) {
                if (token.startsWith('Bearer ')) {                                          // Remove Bearer from string if necessary             
                    token = token.slice(7, token.length);
                }
                var authorization = jwtFunctions.verify(token, database)
                if (authorization == 'success') {                                                   // Try retrieving data if the user is authorized is provided
                    Promise.resolve(dbFunctions.retrieveVotes(database)).then(function (voteData) {
                        res.status(200).end(serialize(voteData));
                    }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
                        res.status(500).send('Token is valid but something went wrong retrieving the data')
                    })
                } else {  
                    var errorMessage = errorFunctions.authenticationErrors(authorization)               // Message if the retriever is not authorized
                    res.status(403).send(`${errorMessage}`);
                }
            } else if (!token) {                                                                        // If no auth token was provided at all
                res.status(403).send('Auth token not provided');
            } else if (!database) {                                                                     // If the user did not specify a database
                res.status(403).send('Please specify which database you want to access by adding ?db=DATABASE_NAME to the URL');
            }
        })

        // Retrieve votes from database
        server.get('/poll/health', function (req, res) {
            // Try retrieving data if the user is authorized is provided
                Promise.resolve(dbFunctions.healthCheck()).then(function (voteData) {
                    res.status(200).send('server ok');
                }).catch((error) => {                                                           // Run this if the retrieving functions returns an error
                    res.status(500).send('server error')
                })
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