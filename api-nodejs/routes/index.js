var express = require('express');
var cidades = require('../models/cidades');
var usuarios = require('../models/usuarios');

var router = express.Router();
var verifier = require('google-id-token-verifier');

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

/* USUARIOS*/
router.post('/api/v1/usuarios', validaToken, usuarios.post);

function validaToken(req, res, next) {
    try {
        var clientId = '478369223387-o0p93v3phs1qeo0362utlj1ra5a6llrm.apps.googleusercontent.com';

        var token = req.headers['x-authority'];

        verifier.verify(token, clientId, function(err, tokenInfo) {
            if (!err) {
                // use tokenInfo in here. 
                console.log(tokenInfo);
            }
            else {
                console.log(err);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
    next();
}

module.exports = router;
