const fs   = require('fs');
const jwt = require('jsonwebtoken');

var publicKEY = fs.readFileSync('./public.key', 'utf8');

var verify = function verifyFunction(token, database) {
    var verifyOptions = {
        iss:  'dash-watch',
        aud:  'dash-watch',
        subject:  database,        
        algorithm:  ["RS256"]
    };
     try {
        jwt.verify(token, publicKEY, verifyOptions, function(err, decoded) {
            if (err) throw err;         
        })     
       return 'success';   
     } catch (err) {
       return err.message;
    }
}

var decode = function decodeFunction(token) {
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
}

module.exports = {
    verify,
    decode,
}