var authenticationErrors = function authenticationFunction(error) {
    if (error.match('jwt subject invalid')) {
        var errorMessage = 'You are not authorized to access this database';
    } else if (error.match('invalid token')){
        var errorMessage = 'The token provided is not valid or has expired';
    } else {
        var errorMessage = `Unknown error: ${error}`;
    }
    return errorMessage;
}

var submitVoteErrors = function voteErrorFunction(error) {
    var errorMessage;
    
    if (error == 'form incomplete') {
        errorMessage = 'You must submit a database, address, message and signature to vote';
    } else if (error == 'invalid address') {
        errorMessage = 'Not a valid Dash address';
    } else if (error == 'invalid signature') {
        errorMessage = 'Invalid signature';
    } else if (error == 'submission error') {
        errorMessage = 'Encountered error submitting the vote';
    } else {
        errorMessage = 'Unknow error'
    }
    return errorMessage;
}

var verifySig = function verifySig(msg, addr, sig) {
     try {
        const isValidSig = msg.verify(addr, sig, function(err, result) {
            if (err) throw err;         
        });   
        return isValidSig;   
     } catch (err) {
        return false;
    }
}

module.exports = {
    authenticationErrors,
    submitVoteErrors,
    verifySig,
}