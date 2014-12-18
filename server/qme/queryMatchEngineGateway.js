var Q = require('q');
var elasticsearch = require('elasticsearch');
var mongoose = require('mongoose-q')();
var uuid = require('node-uuid');


module.exports = {
    matchExistingDocument: matchExistingDocument,
    registerQueryAndStoreMetadata: registerQueryAndStoreMetadata
};

var esIndex = 'qme_profiles';
var esType = 'CombinedProfile';
var mongoDbUri = 'mongodb://findlyauth:dU6Upr6S@westqa07.findly.com?replicaSet=qa-rs0&w=1&ssl=true&sslverifycertificate=false&connectTimeoutMS=99999&socketTimeoutMS=999999&maxIdleTimeMS=60000';    
var esUri = 'westqa07.findly.com:9200';
var esClient;
var QueryMetadata;

activate();

function activate(){
    esClient = new elasticsearch.Client({
        host: esUri,
        log: 'trace'
    });

    var db = mongoose.createConnection(mongoDbUri);
    qmeDb = db.useDb('auth');
    resisterMongoSchema(qmeDb); 
}
    function resisterMongoSchema(db){
        var querymetaSchema = new mongoose.Schema({
            _id: String,
            OrganizationId: Number,
            OrganizationName: String,
            RecruiterId: String,
            RecruiterPhotoUrl: String,
            RecruiterEmail: String,
            CreatedOn: Date
        }, {collection: 'QueryMetadata'});

        QueryMetadata = db.model('QueryMetadata', querymetaSchema);
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
    var queryId = uuid.v1();
    var query = {
        index: esIndex,
        type: '.percolator',
        id: queryId,
        body: {
            // This query will be run against documents sent to percolate
            query: requestArgs.query
        }
    };

    return esClient.index(query).then(function(){
        return storeMetaData(queryId, requestArgs.metadata);
    });
}
    
    function storeMetaData(queryId, metadata){
        return QueryMetadata.create({
            _id: queryId,
            OrganizationId: metadata.organizationId,
            RecruiterId: metadata.recruiterId,
            RecruiterPhotoUrl: metadata.recruiterPhotoUrl,
            RecruiterEmail: metadata.recruiterEmail,
            CreatedOn: metadata.createdOn
        });
    }
