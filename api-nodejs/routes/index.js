var express = require('express');
var router = express.Router();

var cidades = require('../models/cidades');

module.exports = router;

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "x-authority, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/api/v1/cidades', validaToken, cidades.get);
router.get('/api/v1/cidades/:id', validaToken, cidades.getById);
router.post('/api/v1/cidades', validaToken, cidades.post);
router.put('/api/v1/cidades/:id', validaToken, cidades.put);
router.delete('/api/v1/cidades/:id', validaToken, cidades.delete);

function validaToken(req, res, next) {
    console.log(req.headers['x-authority']);
    next();
}
