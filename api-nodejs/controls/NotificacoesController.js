var Usuario = require('../controls/UsuarioController');
const https = require('https');
var API_SERVER_KEY = 'AIzaSyBGyQuDbo6cZTS1ZpTVvfKKZlhgfcbddvo';

module.exports = {
  //login: getUsuarioByGoogleId,
  enviaNotificacao: enviaNotificacao
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
function enviaNotificacao(msg, idGoogle){
  var mensagem = {
      //collapse_key: 'your_collapse_key',
      // data: {
      //     your_custom_data_key: 'your_custom_data_value'
      // },
      notification: {
          title: 'Aplicativo HortApp',
          body: msg
      }
  };
console.log(mensagem);
  Usuario.getTokenFcm(idGoogle, mensagem, function(tokenFcm){
    mensagem['to'] = tokenFcm;
    fcm.send(mensagem)
        .then(function(response){
            console.log("Successfully sent with response: ", response);
        })
        .catch(function(err){
            console.log("Something has gone wrong!");
            console.error(err);
        });
  });
}
