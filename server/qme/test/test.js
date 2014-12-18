var argv = require('yargs').argv;
var QME = require('../queryMatchEngine');


activate();

function activate(){
    switch(argv.action){
        case 'register':
            registerQuery();
            break;
        case 'match':
            matchProfile();
            break;
        default:
            console.log('test --action [register|match]');
    }

}

function registerQuery(){
    var query = {
            "filtered": {
              "query": {
                "query_string": {
                  "query": "***",
                  "fields": [
                    "Profile.ProfessionalDetail.WorkHistories.Description^1",
                    "Profile.ProfessionalDetail.WorkHistories.Description.CustomAnalyzer^1",
                    "Profile.ProfessionalDetail.WorkHistories.Employer^1",
                    "Profile.ProfessionalDetail.WorkHistories.Employer.CustomAnalyzer^1",
                    "Profile.ProfessionalDetail.WorkHistories.JobTitle^1",
                    "Profile.ProfessionalDetail.WorkHistories.JobTitle.CustomAnalyzer^1",
                    "Profile.PersonalDetail.Location.City^4",
                    "Profile.PersonalDetail.Location.Country^4",
                    "Profile.PersonalDetail.Location.PostCode^1",
                    "Profile.PersonalDetail.Location.State^4",
                    "Profile.PersonalDetail.Phone^0.5",
                    "Profile.PersonalDetail.FirstName^1",
                    "Profile.PersonalDetail.LastName^4",
                    "Profile.PersonalDetail.Email^0.5",
                    "OrganizationProfile.JoinCampaign^1",
                    "OrganizationProfile.Campaigns.Name^1",
                    "OrganizationProfile.RecruiterCampaigns.Name^1",
                    "OrganizationProfile.Notes.Content^4",
                    "OrganizationProfile.Notes.Content.CustomAnalyzer^4",
                    "OrganizationProfile.Tags^1",
                    "HrxmlProfiles.Headline^1",
                    "HrxmlProfiles.PersonName.FamilyName^1",
                    "HrxmlProfiles.PersonName.GivenName^1",
                    "HrxmlProfiles.Location^1",
                    "HrxmlProfiles.ExecutiveSummary^1",
                    "HrxmlProfiles.CandidateEducations.OrganizationName^1",
                    "HrxmlProfiles.CandidateEducations.EducationDegree.DegreeMajor^1",
                    "HrxmlProfiles.CandidateEducations.EducationDegree.DegreeName^1",
                    "HrxmlProfiles.CandidateEmployments.OrganizationName^1",
                    "HrxmlProfiles.CandidateEmployments.PositionHistory.PositionTitle^1",
                    "HrxmlProfiles.CandidateEmployments.PositionHistory.Description^1",
                    "RecruiterDocuments.ExtractedContent^1"
                  ],
                  "default_operator": "and",
                  "phrase_slop": 0.0,
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
}

function matchProfile(){
    // edfc57dc-b69e-4e34-9acc-fdfa2016fd35/60c9a3d3-5dba-4d98-9ba3-490198b8be5c  //john zhao
    // 80faaa8e-e94b-4b9e-8f3f-8f8ddab5ab77/757ebfa1-2803-4bb2-b012-b6de165119c9  //gmail.com
    var id = "edfc57dc-b69e-4e34-9acc-fdfa2016fd35/60c9a3d3-5dba-4d98-9ba3-490198b8be5c";  //gmail.com
    QME.matchProfile(id).then(function(result){
        console.log('matchProfile result', JSON.stringify(result, null, ' '));
    },function(error){
        console.log('matchProfile error', error);
    });    
}



/*
    sample match result:
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
*/