var authenticationErrors = function authenticationFunction(error) {
    if (error.match('jwt subject invalid')) {
        var errorMessage = 'You are not authorized to access this database';
    } else if (error.match('invalid token')){
        var errorMessage = 'The token provided is not valid or has expired';
    } else {
        var errorMessage = 'Something went wrong';
    }
    return errorMessage;
}

module.exports = {
    authenticationErrors,
}