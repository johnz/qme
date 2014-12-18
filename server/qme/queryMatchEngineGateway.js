var _ = require('lodash');
var elasticsearch = require('elasticsearch');
var mongoose = require('mongoose-q')();
var uuid = require('node-uuid');


module.exports = {
    matchExistingProfile: matchExistingProfile,
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
        log: 'error'
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


function matchExistingProfile(id) {
    var query = {
        index: esIndex,
        type: esType,
        id: id,
        track_scores: true
    };

    return esClient.percolate(query).then(function(result){
        return extractMetaData(result);
    });
}

    function extractMetaData(result){
        var ids = _.pluck(result.matches, '_id');

        return QueryMetadata.find()
                            .where('_id')
                            .in(ids)
                            .exec();
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
            OrganizationName: metadata.organizationName,
            RecruiterId: metadata.recruiterId,
            RecruiterPhotoUrl: metadata.recruiterPhotoUrl,
            RecruiterEmail: metadata.recruiterEmail,
            CreatedOn: metadata.createdOn
        });
    }
