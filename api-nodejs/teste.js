var usuario = require('./models/Usuario');
var Notificacoes = require('./controls/NotificacoesController');

function getUsuario() {
  usuModel.UsuarioView.where({
      'usuIdGoogle': req.params.usuIdGoogle
    })
    .fetch()
    .then(function(user) {
      if (user) {
        var resposta = user.toJSON();
        var usuario = {
          usuEndVisivel: resposta.usuEndVisivel,
          usuTelefone: resposta.usuTelefone,
          usuTelefoneVisivel: resposta.usuTelefoneVisivel
        };
        var endereco = {
          endLogradouro: resposta.endLogradouro,
          endBairro: resposta.endBairro,
          endNumero: resposta.endNumero,
          cidCodigo: resposta.cidCodigo,
          endLatitude: resposta.endLatitude,
          endLongitude: resposta.endLongitude
        };
        //      console.log({usuario,endereco});
        return res.status(200).json({
          error: false,
          data: {
            usuario,
            endereco
          }
        });
      } else {
        usuModel.Usuario.where({
            'usuIdGoogle': req.params.usuIdGoogle
          })
          .fetch()
          .then(function(user) {
            if (user) {
              var resposta = user.toJSON();
              var usuario = {
                usuEndVisivel: resposta.usuEndVisivel,
                usuTelefone: resposta.usuTelefone,
                usuTelefoneVisivel: resposta.usuTelefoneVisivel
              };
              return res.status(200).json({
                error: false,
                data: {
                  usuario,
                  completarCadastro: true
                }
              });
            }
          })
          .catch(function(err) {
            console.log(err.message);
          });
      }
    })
    .catch(function(err) {
      console.log(err.message);
    });
}

function newUsuario() {
  usuario.Usuario.forge({
      'usuIdGoogle': 108479362120080487745
    })
    .save()
    .then(function(usuario) {
      console.log("\t-> Novo Usuario");
      // usuario = usuario.toJSON();
       console.log('Cadastrado com sucesso!');      
    })
    .catch(function(err) {
      if (err.code === 'ER_DUP_ENTRY') {
        //usuario já cadastrado, não é um erro
        getUsuario();
        return;
      }
      console.log('newUsuario: ' + JSON.stringify(err));      
    });
}

Notificacoes.enviaNotificacao(106728186543816133633, 'Alterado com sucesso!');

