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
router.get('/cidades', validaToken, cidades.get);
router.get('/cidades/:id', cidades.getById);
router.get('/cidades/estado/:id', cidades.getByUfId);
/*
router.post('/cidades', validaToken, cidades.post);
router.put('/cidades/:id', validaToken, cidades.put);
router.delete('/cidades/:id', validaToken, cidades.delete);
*/

/*ENDERECOS*/
router.get('/enderecos', enderecos.get);
router.get('/enderecos/:id', enderecos.getById);
router.post('/enderecos', enderecos.post);

function validaToken(req, res, next) {
    //  next();
    //  return;
    try {
        // var clientId = '281275352003-nrbluthgjnach2lom1u15pct6qj0lgn0.apps.googleusercontent.com';

        var access_token = req.headers['x-access_token'];
        //var id_token = req.headers['x-id_token'];
        console.log(access_token);
        getUserData(access_token);
        next();
        return;
        //http://stackoverflow.com/questions/16501895/how-do-i-get-user-profile-using-google-access-token

        https.get('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + access_token, (resposta) => {
            resposta.on('data', (d) => {
                if(resposta.statusCode==200){
                  console.log('statusCodeGoogle:', resposta.statusCode);
                  process.stdout.write(d);
                //   console.log('headersGoogle:', d);
                //   for (var key of d.keys()) {
                //   console.log(key);
                // }
                  next();
                }
                else{
                    return res.status(resposta.statusCode).json({
                    error: true,
                    data: "Falha na autenticação!"
                });
                }
            });
        }).on('error', (e) => {
             console.error("Erro try: "+e);
            return res.status(500).json({
                    success: false,
                    data: e.message
                });
        });

    }
    catch (err) {
        console.log("Erro geral:" + err);
    }
}

/*É PRECISO HABILITAR A API DO GOOGLE+ NO CONSOLE DO GOOGLE*/
function getUserData(access_token){
  var url = 'https://www.googleapis.com/plus/v1/people/me?access_token='+ access_token;
  try {
      https.get(url, (resposta) => {
          resposta.on('data', (d) => {
              if(resposta.statusCode==200){
                console.log('statusCodeGoogle:', resposta.statusCode);
                process.stdout.write(d);
                // next();
              }
              else{
                console.log("Falha no get dados: "+ resposta.statusCode);
              //     return res.status(resposta.statusCode).json({
              //     error: true,
              //     data: "Falha na autenticação!"
              // });
              }
          });
      }).on('error', (e) => {
           console.error("Erro try: "+e);
          // return res.status(500).json({
          //         success: false,
          //         data: e.message
          //     });
      });

  }
  catch (err) {
      console.log("Erro geral:" + err);
  }

}

/*USUARIO*/
// router.get('/usuario/login', validaToken, enderecos.get);
// router.post('/usuario/sigin', validaToken, enderecos.get);
module.exports = router;
