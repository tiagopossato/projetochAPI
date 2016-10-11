var Usuario = require('../models/Usuario');
var Notificacoes = require('../controls/NotificacoesController');
var Endereco = require('../controls/EnderecoController');
const https = require('https');

module.exports = {
  //login: getUsuarioByGoogleId,
  login: login,
  validaToken: validaToken,
  update: updateUsuario
};

function getUsuarioByGoogleId(googleId) {
  // Grab data from the URL parameters
  Usuario.where({
      usuIdGoogle: googleId
    })
    .fetch()
    .then(function(usuario) {
      console.log(usuario);
    })
    .catch(function(err) {
      console.log(err.message);
    });
}

function newUsuario(req, res, next) {
  console.log("Novo Login: --------------------------------------------------");
  Usuario.forge({
      'usuIdGoogle': req.params.usuIdGoogle
    })
    .save()
    .then(function(usuario) {
      console.log("Novo Usuario: ---------------------------------------");
      console.log(JSON.stringify(usuario));
      return res.status(200).json({
        error: false,
        completarCadastro: true
      });
    })
    .catch(function(err) {
      if (err.code === 'ER_DUP_ENTRY') {
        //usuario já cadastrado, não é um erro
        return res.status(200).json({
          error: false
        });
      }
      console.log(JSON.stringify(err));
      return res.status(500).json({
        error: true,
        data: err.message
      });
    });
}

function updateUsuario(req, res, next) {
  console.log("Update: -----------------------------------------------------");
  //console.log(JSON.stringify(req.query));
  // var endereco = req.query['endereco'];
  // var usuario = req.query['usuario'];
  //
  // console.log('req.params.usuCodigo:' + req.params.usuCodigo);
  // return res.status(444).json({
  //   error: false,
  //   data: "Usuário alterado!"
  // });

  if (req.query['endereco']) {
    Endereco.novo(req, res, function(req, res) {
      var endereco = req.params.endereco.toJSON();
      console.log('req.params.endereco: ' + endereco['endCodigo']);
      var usuario = req.query['usuario'];
      usuario['endCodigo'] = endereco['endCodigo'];
      console.log("Novos dados do Usuario: \n" + JSON.stringify(usuario));
      Usuario.forge({
          'usuCodigo': req.params.usuCodigo
        })
        .save(usuario)
        .then(function(usuario) {
          res.status(200).json({
            error: false,
            data: "Usuário alterado!"
          });
        })
        .catch(function(err) {
          console.log("Erro no Update Usuario: " + JSON.stringify(err));
          res.status(500).json({
            error: true,
            data: err.message
          });
        });
    });
  }
  //
  // if (usuario) {
  //   console.log(usuario);
  // }

}

/*É PRECISO HABILITAR A API DO GOOGLE+ NO CONSOLE DO GOOGLE*/
function login(req, res, next) {
  try {
    var id_token = req.headers['idtoken'];
    var url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' +
      id_token;
    https.get(url, (resposta) => {
      resposta.on('data', (d) => {
        let gData = JSON.parse(d);
        //console.log(gData);
        if (resposta.statusCode == 200) {
          //console.log('statusCodeGoogle:', resposta.statusCode);
          req.params.usuIdGoogle = gData['sub'];
          newUsuario(req, res, next);
        } else {
          console.log("Falha no get dados: " + resposta.statusCode);
          res.status(resposta.statusCode).json({
            error: true,
            data: gData['error_description']
          });
        }
      });
    }).on('error', (e) => {
      console.error("Erro try: " + e);
      res.status(500).json({
        error: true,
        data: e.message
      });
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      data: err.message
    });
  }
}

function update(req, res, usuCodigo) {

  Notificacoes.enviaNotificacao(usuario['usuIdGoogle'],
    'Todos os serviços funcionando!');
}

/**
Método que valida o token recebido no cabeçalho da requisição.

Ao validar o token, verifica se o usuário está cadastrado no banco de dados.
  ->Caso estiver, seta o parametro req.params.usuCodigo com o codigo do usuario
no banco de dados.
  ->Caso nao estiver cadastrado, retorna mensagem que necessita de cadastro.
*/
function validaToken(req, res, next) {
  console.log('validaToken');
  try {
    var id_token = req.headers['idtoken'];
    var url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' +
      id_token;
    https.get(url, (resposta) => {
      resposta.on('data', (d) => {
        // console.log('statusCodeGoogle:', resposta.statusCode);
        let gData = JSON.parse(d);
        //console.log(gData);
        if (resposta.statusCode === 200) {
          Usuario.where({
              'usuIdGoogle': gData['sub']
            })
            .fetch()
            .then(function(user) {
              if (user) {
                usuario = user.toJSON();
                req.params.usuCodigo = usuario['usuCodigo'];
                next();
              } else {
                res.status(500).json({
                  error: true,
                  data: "Você precisa estar cadastrado para acessar essa parte do sistema!"
                });
              }
            })
            .catch(function(err) {
              res.status(500).json({
                error: true,
                data: err.message
              });
            });
        } else {
          //console.log(dados['error_description']);
          res.status(resposta.statusCode).json({
            error: true,
            data: dados['error_description']
          });
        }
      });
    }).on('error', (err) => {
      //console.error(err.message);
      res.status(500).json({
        error: true,
        data: err.message
      });
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      data: err.message
    });
  }
}

/*
function getTokenFcm(usuIdGoogle, mensagem, next){
  Usuario.where({usuIdGoogle: usuIdGoogle})
  .fetch()
  .then(function (user) {
    // console.log(user);
    if(user){
      usuario = user.toJSON();
      var tokenFcm = usuario['usuTokenFcm'];
      if(tokenFcm){
        next(tokenFcm);
      }
    }
    else  res.status(500).json({error: true, data: 'Usuário não cadastrado'});
  })
  .catch(function (err) {
    console.log(err.message);
    res.status(500).json({error: true, data: err.message});
  });
}
*/
