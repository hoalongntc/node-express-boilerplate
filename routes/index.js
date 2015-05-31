module.exports = function(app) {
    var express = require('express');
    var router = express.Router();

    router.get('/*', function(req, res) {
        res.redirect(app.CLIENT_PATH);
    });

    return router;
};