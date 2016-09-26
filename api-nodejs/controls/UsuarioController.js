var Usuario = require('../models/Usuario');
const https = require('https');

module.exports = {
  login: getUsuarioByGoogleId,
  getUserData: getUserData,
  validaToken: validaToken
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


function upsertUsuario(dados, req, res, next){
  Usuario.where({usuIdGoogle: dados['usuIdGoogle']})
  .fetch()
  .then(function (user) {
    // console.log(user);
    if(user){
      usuario = user.toJSON();
      var id = usuario['usuCodigo'];
      console.log("id: "+id);
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

function newUsuario(dados, req, res, next){
  Usuario.forge(dados)
  .save()
  .then(function (usuario) {
    console.log(usuario);
    res.status(200).json({error: false, data: "Usuário criado!"});
  })
  .catch(function (err) {
    console.log(err.message);
    res.status(500).json({error: true, data: err.message});
  });
}

function updateUsuario(dados, req, res, next){
  console.log("Update: -----------------------------------------------------");
  console.log(dados);

  Usuario.forge({usuCodigo: dados['usuCodigo']})
  .save(dados)
  .then(function (usuario) {
    console.log(usuario);
    res.status(200).json({error: false, data: "Usuário alterado!"});
  })
  .catch(function (err) {
    console.log(err.message);
    res.status(500).json({error: true, data:err.message});
  });
}

/*É PRECISO HABILITAR A API DO GOOGLE+ NO CONSOLE DO GOOGLE*/
function getUserData(req, res, next){
  var access_token = req.headers['x-access_token'];

  var url = 'https://www.googleapis.com/plus/v1/people/me?access_token='+ access_token;
  try {
    https.get(url, (resposta) => {
      resposta.on('data', (d) => {
        let gData = JSON.parse(d);
        //console.log(gData);
        if(resposta.statusCode==200){
          console.log('statusCodeGoogle:', resposta.statusCode);
          var dados={
            usuIdGoogle: gData['id'],
            usuNome:  gData['name']['givenName']+" "+gData['name']['familyName'],
            usuEmail: gData['emails'][0]['value'],
            usuImagem: gData['image']['url']
          };
          upsertUsuario(dados, req, res, next);
        }
        else{
          console.log("Falha no get dados: "+ resposta.statusCode);
          return res.status(resposta.statusCode).json({
            error: true,
            data: resposta.message
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

function validaToken(req, res, next) {
  try {
    var clientId = '281275352003-nrbluthgjnach2lom1u15pct6qj0lgn0.apps.googleusercontent.com';
    var access_token = req.headers['x-access_token'];
    https.get('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + access_token, (resposta) => {
      resposta.on('data', (d) => {
        console.log('statusCodeGoogle:', resposta.statusCode);
        console.log(JSON.parse(d));
        if(resposta.statusCode==200){
          next();
        }
        else{
          return res.status(resposta.statusCode).json({
            error: true,
            data: JSON.parse(d)
          });
        }
      });
    }).on('error', (e) => {
      console.error(e);
      return res.status(500).json({
        error: true,
        data: e
      });
    });
  }
  catch (err) {
    console.log("Erro geral:" + err);
  }
}
