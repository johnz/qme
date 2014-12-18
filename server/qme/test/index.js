/*
    1. generate search queries
    2. store search queries to index
    3. try store meta data
    4. percolate doc against queries 
    5. try extract useful info, 
       i.e. 7 recruiter search people like you cross 5 orgs 

    presentation:
    1. what's query match engine
            it use job seekers profile to match recruiters search queries
            we store all recruiter search queries in ElasticSearch against profile indexes
       why we doing this?
            we could extract some useful infomation 7 recruiter search people like you cross 5 orgs


    2. how it works 
    3. what can we use it for   
*/

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'westqa07.findly.com:9200',
    log: 'trace'
});

percolateRegisterQuery();
//percolateExistingDocument('f1b8f1ee-aef6-43a0-9c2a-636dce1dbb3e/7b6e651d-a3de-4c55-b2f1-028574d2615f');
//search();



function percolateExistingDocument(id) {
    client.percolate({
        index: 'qme_profiles',
        type: 'CombinedProfile',
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

function percolateRegisterQuery() {
    client.index({
        index: 'qme_profiles',
        type: '.percolator',
        id: 'q3',
        body: {
            // This query will be run against documents sent to percolate
            query: {
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
                },
                meta: {
                    org: 23,
                    date: "17/12/2014"
                }
            }
        }
    }, function(error, response) {
        // ...
    });
}

function search() {
    client.search({
        index: 'qme_profiles', //waggle_profiles_v12
        type: 'CombinedProfile',
        body: {
            "from": 0,
            "size": 2,
            "query": {
                "filtered": {
                    "query": {
                        "query_string": {
                            "query": "j***",
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
            }
        }

    }).then(function(resp) {
        var hits = resp.hits.hits;
    }, function(err) {
        console.trace(err.message);
    });
}