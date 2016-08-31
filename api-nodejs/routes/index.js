var express = require('express');
var cidades = require('../models/cidades');
var usuarios = require('../models/usuarios');
const https = require('https');

var router = express.Router();
var verifier = require('google-id-token-verifier');
var GoogleAuth = require('google-auth-library');



var auth = new GoogleAuth();

var oauth2Client = new auth.OAuth2();

var request = require('ajax-request');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "x-access_token, x-id_token, Origin, X-Requested-With, Content-Type, Accept");
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
        var clientId = '281275352003-nrbluthgjnach2lom1u15pct6qj0lgn0.apps.googleusercontent.com';

        var access_token = req.headers['x-access_token'];
        //var id_token = req.headers['x-id_token'];
        //console.log(id_token);

        https.get('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + access_token, (res) => {
            console.log('statusCode:', res.statusCode);
            //console.log('headers:', res.headers);

            res.on('data', (d) => {
                process.stdout.write(d);
            });

        }).on('error', (e) => {
            console.error(e);
        });

    }
    catch (err) {
        console.log("Erro geral:" + err);
    }
    next();
}


module.exports = router;
