var express = require('express');
var router = express.Router();

var cidades = require('../models/cidades');

module.exports = router;

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/api/v1/cidades', cidades.get);
router.get('/api/v1/cidades/:id', cidades.getById);
router.post('/api/v1/cidades', cidades.post);
router.put('/api/v1/cidades/:id', cidades.put);
router.delete('/api/v1/cidades/:id', cidades.delete);