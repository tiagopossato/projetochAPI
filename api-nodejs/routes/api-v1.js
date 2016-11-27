var express = require('express');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

// var cidades = require('../controls/CidadeController');
// var enderecos = require('../controls/EnderecoController');
var usuarios = require('../controls/UsuarioController');
var ofertas = require('../controls/OfertaController');
var notificacoes = require('../controls/NotificacoesController');

var router = express.Router();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "idtoken, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*USUARIO*/
//LOGIN, não usa midleware para validar o token, porém valida internamente
router.get('/usuario/login', usuarios.login);
router.get('/usuario/update/me', upload.array(),
  usuarios.validaToken, usuarios.update);

/*OFERTAS*/
router.get('/ofertas', /*usuarios.validaToken,*/ ofertas.get);
router.get('/oferta/:id', /*usuarios.validaToken,*/ ofertas.getById);
router.get('/minhasofertas', usuarios.validaToken, ofertas.minhasOfertas);
router.get('/novaoferta', usuarios.validaToken, ofertas.post);
router.get('/alteraoferta', usuarios.validaToken, ofertas.put);
router.post('/recebefoto', usuarios.validaToken, ofertas.recebeFoto);

router.get('/mensagem', usuarios.validaToken, notificacoes.novaMensagem);
/*CIDADES*/
// router.get('/cidades', usuarios.validaToken, cidades.get);
// router.get('/cidades/:id', usuarios.validaToken, cidades.getById);
// router.get('/cidades/estado/:id', usuarios.validaToken, cidades.getByUfId);
/*
router.post('/cidades', validaToken, cidades.post);
router.put('/cidades/:id', validaToken, cidades.put);
router.delete('/cidades/:id', validaToken, cidades.delete);
*/

/*ENDERECOS*/
// router.get('/enderecos', usuarios.validaToken, enderecos.get);
// router.get('/enderecos/:id', usuarios.validaToken, enderecos.getById);
// router.post('/enderecos', usuarios.validaToken, enderecos.post);

module.exports = router;
