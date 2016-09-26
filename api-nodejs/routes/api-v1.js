var express = require('express');
var cidades = require('../controls/CidadeController');
var enderecos = require('../controls/EnderecoController');
var usuarios = require('../controls/UsuarioController');
const https = require('https');

var router = express.Router();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "x-access_token, x-id_token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*CIDADES*/
router.get('/cidades',  usuarios.validaToken, cidades.get);
router.get('/cidades/:id', usuarios.validaToken, cidades.getById);
router.get('/cidades/estado/:id', usuarios.validaToken, cidades.getByUfId);
/*
router.post('/cidades', validaToken, cidades.post);
router.put('/cidades/:id', validaToken, cidades.put);
router.delete('/cidades/:id', validaToken, cidades.delete);
*/

/*ENDERECOS*/
router.get('/enderecos', usuarios.validaToken, enderecos.get);
router.get('/enderecos/:id', usuarios.validaToken, enderecos.getById);
router.post('/enderecos', usuarios.validaToken, enderecos.post);

/*USUARIO*/
router.get('/usuario/login', usuarios.login);
// router.post('/usuario/sigin', validaToken, enderecos.get);
module.exports = router;
