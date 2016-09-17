var express = require('express');
var cidades = require('../models/cidades');
var usuarios = require('../models/usuarios');
const https = require('https');

var router = express.Router();

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "x-access_token, x-id_token, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/v1/cidades', validaToken, cidades.get);
router.get('/v1/cidades/:id', validaToken, cidades.getById);
router.post('/v1/cidades', validaToken, cidades.post);
router.put('/v1/cidades/:id', validaToken, cidades.put);
router.delete('/v1/cidades/:id', validaToken, cidades.delete);

/* USUARIOS*/
router.post('/v1/usuarios', validaToken, usuarios.post);

function validaToken(req, res, next) {
    try {
        var clientId = '281275352003-nrbluthgjnach2lom1u15pct6qj0lgn0.apps.googleusercontent.com';

        var access_token = req.headers['x-access_token'];
        //var id_token = req.headers['x-id_token'];
        //console.log(id_token);

        https.get('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + access_token, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);

            res.on('data', (d) => {
                process.stdout.write(d);
                next();
            });

        }).on('error', (e) => {
            console.error(e);
        });

    }
    catch (err) {
        console.log("Erro geral:" + err);
    }

}


module.exports = router;
