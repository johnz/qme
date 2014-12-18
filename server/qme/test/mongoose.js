
var Q = require('q');

var mongoose = require('mongoose-q')();
var uuid = require('node-uuid');

//findlyswarm:gE7pehAc

var mongoDbUri = 'mongodb://findlyauth:dU6Upr6S@westqa07.findly.com?replicaSet=qa-rs0&w=1&ssl=true&sslverifycertificate=false';    
var QueryMetadata;


activate();
registerQueryAndStoreMetadata();

function activate(){
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



function registerQueryAndStoreMetadata() {
    var queryId = uuid.v1();
    console.log('queryId', queryId);

    QueryMetadata.create({
        _id: queryId,
        OrganizationId: 23,
        RecruiterId: 'f25c9253-47f0-4cb8-941d-99f2b4dae528',
        RecruiterPhotoUrl: '//findlytestrefresh.blob.core.windows.net/profilephoto/000/413/266/80.jpg',
        RecruiterEmail: 'sara_ney_2@hotmail.com',
        CreatedOn: Date.now()
    }).then(function(result){
        console.log(result);
    }, function (error) {
        console.log('error', result);
    });
}
