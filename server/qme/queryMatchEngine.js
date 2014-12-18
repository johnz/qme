var Q = require('q');
var queryMatchEngineGateway = require('./queryMatchEngineGateway');

module.exports = {
    registerQuery: registerQuery,
    matchDocument: matchDocument
};


function registerQuery(requestArgs){
    /*
        requestArgs: {
            query: query,
            metadata: {
                organizationId: number,
                organizationName: string
                recruiterId: string,
                recruiterPhotoUrl: string,
                recruiterEmail: string
                createdOn: dateTime
            }
        }
    */
    var deferred = Q.defer();
    
    var query = isValidQuery(requestArgs);
    
    if(!query.isValid){
        deferred.reject(query.errorCode); 
        return deferred.promise;   
    }

    requestArgs.query = removeOrganizationFilter(requestArgs.query);

    return registerQueryAndStoreMetadata(requestArgs);
}

    function isValidQuery(requestArgs){
        /*
            if email from findly.com mark as invalid, error:IMPLEMENTATION_ACCOUNT
            if org from iBee mark as invalid, error:DEMO_ORG
            if its quick search mark as invalid, error:QUICK_SEARCH
            if its advanced search with organization profile, error:ORGPROFILE_SEARCH
        */

        var isValid = true;
        var errorCode;

        //TODO: apply filters
        
        return {
            isValid: isValid,
            errorCode: errorCode
        }
    }

    function removeOrganizationFilter(query){
        //TODO: remove org filter make the query match pofile from all orgs

        return query; 
    }

    function registerQueryAndStoreMetadata(requestArgs){
        return queryMatchEngineGateway.registerQueryAndStoreMetadata(requestArgs);
    }

function matchDocument(){
    // return promise
}

