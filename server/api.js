module.exports = function(app) {
    var QME = require('./qme/queryMatchEngine');

    app.get('/api/match', matchProfile);

    function matchProfile(req, res, next) {
        var id = req.query.id

        QME.matchProfile(id).then(function(result){
            res.send(result);
        },function(error){
            res.send(error);
        });
    }
};