var QME = require('../queryMatchEngine');

var query = {
                "filtered": {
                    "query": {
                        "query_string": {
                            "query": "***yahoo.com",
                            "fields": [
                                "Profile.PersonalDetail.FirstName^5",
                                "Profile.PersonalDetail.LastName^5",
                                "Profile.PersonalDetail.Email^7"
                            ],
                            "default_operator": "and",
                            "auto_generate_phrase_queries": true
                        }
                    }
                }
            };

QME.registerQuery({
    query: query,
    metadata: {
        organizationId: 23,
        organizationName: 'Sears',
        recruiterId: 'f25c9253-47f0-4cb8-941d-99f2b4dae528',
        recruiterPhotoUrl: '//findlytestrefresh.blob.core.windows.net/profilephoto/000/413/266/80.jpg',
        recruiterEmail: 'sara_ney_2@hotmail.com',
        createdOn: Date.now()
    }
}).then(function(result){
    console.log('result',result);
},function(error){
    console.log('error',error);
});