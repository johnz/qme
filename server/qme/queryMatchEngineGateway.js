var Q = require('q');
var elasticsearch = require('elasticsearch');
var mongoose = require('mongoose');
var uuid = require('node-uuid');


module.exports = {
    matchExistingDocument: matchExistingDocument,
    registerQueryAndStoreMetadata: registerQueryAndStoreMetadata
};

var esIndex = 'qme_profiles';
var esType = 'CombinedProfile';
var mongoDbUri = 'mongodb://findlyauth:dU6Upr6S@westqa07.findly.com/qme?replicaSet=qa-rs0&w=1&ssl=true&sslverifycertificate=false&connectTimeoutMS=99999&socketTimeoutMS=999999&maxIdleTimeMS=60000';    
var esUri = 'westqa07.findly.com:9200';
var esClient;
var QueryMetadata;

activate();

function activate(){
    esClient = new elasticsearch.Client({
        host: esUri,
        log: 'trace'
    });

    mongoose.connect(mongoDbUri);
    resisterMongoSchema(); 
}
    function resisterMongoSchema(){
        var querymetaSchema = new mongoose.Schema({
            _id: String,
            OrganizationId: Number,
            OrganizationName: String,
            RecruiterId: String,
            RecruiterPhotoUrl: String,
            RecruiterEmail: String,
            CreatedOn: Date
        });

        QueryMetadata = mongoose.model('QueryMetadata', querymetaSchema);
    }


function matchExistingDocument(id) {
    esClient.percolate({
        index: esIndex,
        type: esType,
        id: id,
        track_scores: true
    }, function(error, response) {
        // response would equal
        // {
        //   ok:true,
        //   matches: [ "alert-1" ]
        // }
    });
}

function registerQueryAndStoreMetadata(requestArgs) {
    var deferred = Q.defer();
    var queryId = uuid.v1();

    return esClient.index({
        index: esIndex,
        type: esType,
        id: queryId,
        body: {
            // This query will be run against documents sent to percolate
            query: requestArgs.query
        }
    }).then(function(result){
        QueryMetadata.create({
            _id: queryId,
            OrganizationId: requestArgs.metadata.organizationId,
            RecruiterId: requestArgs.metadata.recruiterId,
            RecruiterPhotoUrl: requestArgs.metadata.recruiterPhotoUrl,
            RecruiterEmail: requestArgs.metadata.recruiterEmail,
            CreatedOn: requestArgs.metadata.createdOn
        });
    });
}