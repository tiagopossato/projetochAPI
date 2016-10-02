var Usuario = require('../models/Usuario');
var Notificacoes = require('../controls/NotificacoesController');
const https = require('https');

module.exports = {
  //login: getUsuarioByGoogleId,
  login: login,
  validaToken: validaToken,
  update: update
};

function getUsuarioByGoogleId(googleId) {
  // Grab data from the URL parameters
  Usuario.where({usuIdGoogle: googleId})
  .fetch()
  .then(function (usuario) {
    console.log(usuario);
  })
  .catch(function (err) {
    console.log(err.message);
  });
}

function newUsuario(dados, req, res, next){
  console.log("Novo Usuario: -----------------------------------------------------");
  Usuario.forge(dados)
  .save()
  .then(function (usuario) {
    //console.log(usuario);
    res.status(200).json({error: false, completarCadastro: true});
  })
  .catch(function (err) {
    console.log(err.message);
    res.status(500).json({error: true, data: err.message});
  });
}

function updateUsuario(dados, req, res, next){
  console.log("Update: -----------------------------------------------------");
  //console.log(dados);

  Usuario.forge({usuCodigo: dados['usuCodigo']})
  .save(dados)
  .then(function (usuario) {
    //console.log(usuario);
    res.status(200).json({error: false, data: "Usuário alterado!"});
  })
  .catch(function (err) {
    console.log(err.message);
    res.status(500).json({error: true, data:err.message});
  });
}

function upsertUsuario(dados, req, res, next){
  Usuario.where({usuIdGoogle: dados['usuIdGoogle']})
  .fetch()
  .then(function (user) {
    // console.log(user);
    if(user){
      usuario = user.toJSON();
      var id = usuario['usuCodigo'];
      //console.log("id: "+id);
      if(id){
        dados['usuCodigo'] = id;
        updateUsuario(dados, req, res, next);
      }
    }
    else  newUsuario(dados, req, res, next);
  })
  .catch(function (err) {
    console.log(err.message);
    res.status(500).json({error: true, data: err.message});
  });
}

/*É PRECISO HABILITAR A API DO GOOGLE+ NO CONSOLE DO GOOGLE*/
function login(req, res, next){
  //console.log(req.headers);
  try {
    var id_token = req.headers['idtoken'];
    var url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+ id_token;
    https.get(url, (resposta) => {
      resposta.on('data', (d) => {
        let gData = JSON.parse(d);
        //console.log(gData);
        if(resposta.statusCode==200){
          //console.log('statusCodeGoogle:', resposta.statusCode);
          var dados={
            usuIdGoogle: gData['sub'],
            usuNome:  gData['name'],
            usuEmail: gData['email'],
            usuImagem: gData['picture']
          };
          upsertUsuario(dados, req, res, next);
        }
        else{
          console.log("Falha no get dados: "+ resposta.statusCode);
          return res.status(resposta.statusCode).json({
            error: true,
            data: gData['error_description']
          });
        }
      });
    }).on('error', (e) => {
      console.error("Erro try: "+e);
      return res.status(500).json({
        error: true,
        data: e.message
      });
    });
  }
  catch (err) {
    return res.status(500).json({
      error: true,
      data: err.message
    });
  }
}

function update(req, res, next){
  var id = req.params.id;
  var dados={
    usuIdGoogle: id,
    usuTokenFcm: req.query.usuTokenFcm
  };
  upsertUsuario(dados, req, res, next);
  Notificacoes.enviaNotificacao(usuario['usuIdGoogle'], 'Todos os serviços funcionando!');
}

function validaToken(req, res, next) {
  try {
    var id_token = req.headers['idtoken'];
    var url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+ id_token;
    https.get(url, (resposta) => {
      resposta.on('data', (d) => {
        //console.log('statusCodeGoogle:', resposta.statusCode);
        let gData = JSON.parse(d);
        console.log(gData);
        if(resposta.statusCode==200){
          Usuario.where({usuIdGoogle: gData['sub']})
          .fetch()
          .then(function (user) {
            if(user){
              usuario = user.toJSON();
              var id = usuario['usuCodigo'];
              if(id){
                next();
              }else res.status(500).json({error: true, data: "Parece que você está cadastrado, mas um erro ocorreu no sistema!!"});
            }
            else res.status(500).json({error: true, data: "Você precisa estar cadastrado para acessar essa parte do sistema!"});
          })
          .catch(function (err) {
            res.status(500).json({error: true, data: err.message});
          });
        }
        else{
          //console.log(dados['error_description']);
          return res.status(resposta.statusCode).json({
            error: true,
            data: dados['error_description']
          });
        }
      });
    }).on('error', (err) => {
      //console.error(err.message);
      return res.status(500).json({
        error: true,
        data: err.message
      });
    });
  }
  catch (err) {
    return res.status(500).json({
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
