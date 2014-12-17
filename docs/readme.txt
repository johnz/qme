Tasks
    1. Server: Generate search queries
       Generate search queries and store against 
       - sample search query can be seen from same folder
       - query doesn't need to include orgnization filter
       - query doesn't need to include orgnization profile related filters
       - simple search is not quite relevant, since its search for specific person
    2. Server: Store search queries to ES index qme_profiles
    3. Server: Store meta data to mongo
        - _id: guid string (queryid)
        - organizationId: integer
        - recruiterId: guid
        - recruiterPhotoUrl: string
    4. Server: Percolate doc against queries and return list of matched query ids
    5. Server: Extract metadata from matched query ids
    6. UI: build webpage allow people to select/enter profileId
    7. UI: once select/enter profileId send request to Query Match Engine api 
    8. UI: display result, 
        - i.e. 8 recruiters search profile like you from 5 orgnizations 
               ** display recruiter's photo if have time  



Setup:
- get source code from github ...
- install nodejs http://nodejs.org/download/
- install all node packages from project root: npm install
- install gulp 
- test engine from console: node server\qme\console.js
- start demo website: gulp serve-dev
- run demo website from localhost:9300


Presentation ideas:
- Team Members
  - John, Karl, Agnes

- What's problem it try to solve?
  - Engage people come to Thehive follow other orgnizations
  - Unlock profile from other orgnization, so recruiter can search it in waggle
  - Encourage people to update their profile, so can get higher chance to get hired

- What's query match engine
  - Use job seekers profile to match all recruiters search queries and find out how many query matched
  - Use the metadata stored against each query to extract search related information for specific job seeker

- How it works?
  - Store all recruiter search queries in ElasticSearch against profile index
  - Also store meta data for each query, i.e. organization id, search date, recruiter id

- Demo?
  - Start website run demo against selected profile and display ? number of recruiter from ? number of organization interested you in last 30 days

- What else can we use it for?
  - Waggle smart group ... when new profile created procolate against all smart group queries...

