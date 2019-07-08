const fs   = require('fs');
const jwt = require('jsonwebtoken');

var publicKEY = fs.readFileSync('./public.key', 'utf8');

var verify = function verifyFunction(token) {
     try {
        jwt.verify(token, publicKEY, function(err, decoded) {
            if (err) throw err;         
        })     
       return true;   
     } catch (err) {
       return false;
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