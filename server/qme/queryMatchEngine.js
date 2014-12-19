var _ = require('lodash');
var Q = require('q');
var queryMatchEngineGateway = require('./queryMatchEngineGateway');

module.exports = {
    registerQuery: registerQuery,
    matchProfile: matchProfile
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

function matchProfile(id){
    var deferred = Q.defer();

    queryMatchEngineGateway.matchExistingProfile(id).then(function(result){
        var response = generateMatchProfileResponse(result);
        deferred.resolve(response);
    },function(error){
        deferred.reject(error); 
    });

    return deferred.promise;   
}
    
    function generateMatchProfileResponse(result){
        var dedupledRecruiters = _.uniq(result, 'RecruiterId');
        var dedupledOrgs = _.uniq(result, 'OrganizationId');
        var recruiterPhotos = _.pluck(dedupledRecruiters, 'RecruiterPhotoUrl');
        var orgnizations = _.pluck(dedupledOrgs, 'OrganizationName');

        return {
            totalSearches: result.length,
            totalRecruiters: dedupledRecruiters.length,
            totalOrganizations: dedupledOrgs.length,
            organizations: orgnizations,
            recruiterPhotos: recruiterPhotos
        };
    }


/*
    sample match response from gateway:
    [
        {
            "_id": "86f65330-8660-11e4-988d-e7fed3fe2e4d",
            "OrganizationId": 23,
            "RecruiterId": "f25c9253-47f0-4cb8-941d-99f2b4dae528",
            "RecruiterPhotoUrl": "//findlytestrefresh.blob.core.windows.net/profilephoto/000/413/266/80.jpg",
            "RecruiterEmail": "sara_ney_2@hotmail.com",
            "CreatedOn": "2014-12-18T02:49:46.723Z",
            "__v": 0
        },
        {
            "_id": "899ff9f0-8661-11e4-b080-137d4e517cb8",
            "OrganizationId": 23,
            "RecruiterId": "f25c9253-47f0-4cb8-941d-99f2b4dae528",
            "RecruiterPhotoUrl": "//findlytestrefresh.blob.core.windows.net/profilephoto/000/413/266/80.jpg",
            "RecruiterEmail": "sara_ney_2@hotmail.com",
            "CreatedOn": "2014-12-18T02:57:00.687Z",
            "__v": 0
        }
    ]

    sample final result
    {
        "totalRecruiters": 1,
        "totalOrganizations": 1,
        "recruiterPhotos": [
            "//findlytestrefresh.blob.core.windows.net/profilephoto/000/413/266/80.jpg"
        ],
        "organizations": [
            "Sears"
        ]
    }
*/