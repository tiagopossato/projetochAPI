var Usuario = require('../models/Usuario');
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
function enviaNotificacao(idGoogle, msg){
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
  try{
		Usuario.where({usuIdGoogle: idGoogle})
		.fetch()
		.then(function (user) {
		//console.log(user.toJSON());
			if(user){
				usuario = user.toJSON();
				var tokenFcm = usuario['usuTokenFcm'];
				if(tokenFcm){
					mensagem['to'] = tokenFcm;
					console.log(mensagem);
					fcm.send(mensagem)
						.then(function(response){
							console.log("Successfully sent with response: ", response);
						})
						.catch(function(err){
							console.log("Something has gone wrong!");
							console.error(err);
						});
				}
			}
		})
		.catch(function (err) {
			console.log(err);
		});
  }catch(err){console.log(err);}
}
