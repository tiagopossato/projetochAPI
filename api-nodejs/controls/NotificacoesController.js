var usuModel = require('../models/Usuario');
const https = require('https');
var API_SERVER_KEY = 'AIzaSyBGyQuDbo6cZTS1ZpTVvfKKZlhgfcbddvo';

module.exports = {
  enviaNotificacao: enviaNotificacao,
  enviaNotificacaoGeral: enviaNotificacaoGeral
};

var FCM = require('fcm-push');
var fcm = new FCM(API_SERVER_KEY);

/**
var message = {
collapse_key: 'your_collapse_key',
data: {
your_custom_data_key: 'your_custom_data_value'
},
notification: {
title: 'Title of your push notification',
body: 'Body of your push notification'
}
};
*/
function enviaNotificacao(idGoogle, msg) {
  var mensagem = {
    //collapse_key: 'your_collapse_key',
    // data: {
    //     your_custom_data_key: 'your_custom_data_value'
    // },
    //delay_while_idle : true,
    notification: {
      title: 'Aplicativo HortApp',
      body: msg
    }
  };
  //console.log(mensagem);
  usuModel.Usuario.where({
      usuIdGoogle: idGoogle
    })
    .fetch()
    .then(function(user) {
      //console.log(user.toJSON());
      if (user) {
        usuario = user.toJSON();
        var tokenFcm = usuario['usuTokenFcm'];
        if (tokenFcm) {
          mensagem['to'] = tokenFcm;
          //console.log(mensagem);
          fcm.send(mensagem)
            .then(function(response) {
              console.log("Mensagem enviada");
            })
            .catch(function(err) {
              console.log("Something has gone wrong!");
              console.error(err);
            });
        }
      }
    })
    .catch(function(err) {
      console.log('enviaNotificacao->Usuario.where:' + err);
    });
}

function enviaNotificacaoGeral(msg) {
  var mensagem = {
    notification: {
      title: 'Aplicativo HortApp',
      body: msg
    }
  };
  //console.log(mensagem);
  usuModel.Usuario
    .fetch()
    .then(function(user) {
      //console.log(user.toJSON());
      let i = 0;
      for (; i < user.length; i++) {
        usuario = user[i].toJSON();
        var tokenFcm = usuario['usuTokenFcm'];
        if (tokenFcm) {
          mensagem['to'] = tokenFcm;
          //console.log(mensagem);
          fcm.send(mensagem)
            .then(function(response) {
              console.log("Mensagem enviada");
            })
            .catch(function(err) {
              console.log("Something has gone wrong!");
              console.error(err);
            });
        }
      }
    })
    .catch(function(err) {
      console.log('enviaNotificacao->Usuario.where:' + err);
    });
}
