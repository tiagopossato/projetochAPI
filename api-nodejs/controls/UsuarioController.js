"use strict";
var usuModel = require('../models/Usuario');
var Notificacoes = require('../controls/NotificacoesController');
var Endereco = require('../controls/EnderecoController');
const https = require('https');

module.exports = {
  //login: getUsuarioByGoogleId,
  login: login,
  validaToken: validaToken,
  update: updateUsuario
};

function getUsuario(req, res, next) {
  usuModel.UsuarioView.where({
      'usuIdGoogle': req.params.usuIdGoogle
    })
    .fetch()
    .then(function(user) {
      if (user) {
        var resposta = user.toJSON();
        var usuario = {
          endCodigo: resposta.endCodigo,
          usuEndVisivel: resposta.usuEndVisivel,
          usuTelefone: resposta.usuTelefone,
          usuTelefoneVisivel: resposta.usuTelefoneVisivel
        };
        var endereco = {
          endCep: resposta.endCep,
          endLogradouro: resposta.endLogradouro,
          endBairro: resposta.endBairro,
          endNumero: resposta.endNumero,
          cidCodigo: resposta.cidCodigo,
          ufCodigo: resposta.ufCodigo,
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

function newUsuario(req, res, next) {
  usuModel.Usuario.forge({
      'usuIdGoogle': req.params.usuIdGoogle,
      'usuNome': req.params.usuNome,
      'usuEmail': req.params.usuEmail,
      'usuImagem': req.params.usuImagem
    })
    .save()
    .then(function(usuario) {
      console.log("\t-> Novo Usuario");
      usuario = usuario.toJSON();
      Notificacoes.enviaNotificacao(usuario['usuIdGoogle'],
        'Cadastrado com sucesso!');
      res.status(200).json({
        error: false,
        data: {
          completarCadastro: true
        }
      });
    })
    .catch(function(err) {
      if (err.code === 'ER_DUP_ENTRY') {
        //usuario já cadastrado, não é um erro
        getUsuario(req, res, next);
        return;
      }
      console.log('newUsuario: ' + JSON.stringify(err));
      res.status(500).json({
        error: true,
        data: err.message
      });
    });
}

function updateUsuario(req, res, next) {
  console.log("\t-> updateUsuario");
  //console.log(req.query);
  var endereco = req.query['endereco'];
  var usuario = req.query['usuario'];
  //console.log("endereco:" + JSON.stringify(endereco));
  console.log("usuario:" + usuario);
  //caso receber um endereço junto com os dados do usuario
  //altera o endereco e o usuario
  if (endereco) {
    var dados = req.query['endereco'];
    if (!dados) {
      console.log(
        'novoEndereco: dados não definidos, verifique se estão vindo via req.query!'
      );
    }
    Endereco.novo(dados, req, res, function(req, res) {
      var endereco = req.params.endereco.toJSON();
      // console.log('req.params.endereco: ' + endereco['endCodigo']);
      var usuario = req.query['usuario'];
      usuario['endCodigo'] = endereco['endCodigo'];
      //console.error(req.body['usuario']);
      //console.log("Novos dados do Usuario: \n" + JSON.stringify(usuario));
      //Endereco.apaga();
      //console.log('usuCodigo:' + req.params.usuCodigo);
      usuModel.Usuario.forge({
          'usuCodigo': req.params.usuCodigo
        })
        .save(usuario)
        .then(function(user) {
          var resposta = user.toJSON();
          var usuario = {
            endCodigo: resposta.endCodigo
          };
          return res.status(200).json({
            error: false,
            data: {
              usuario
            }
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
  //caso nao receber o endereco, altera somente o usuario
  else
  //verifica se os dados enviados existem
  if (usuario) {
    // console.log("Novos dados do Usuario:" + JSON.stringify(usuario));
    usuModel.Usuario.forge({
        'usuCodigo': req.params.usuCodigo
      })
      .save(usuario)
      .then(function(user) {
        var usuario = user.toJSON();
        //console.log('usuCodigo:' + req.params.usuCodigo);
        //console.log('usuario: ' + JSON.stringify(usuario));
        //Notificacoes.enviaNotificacao(req.params.usuIdGoogle,
        //  'Alterado com sucesso!');
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
  } else {

    res.status(500).json({
      error: true,
      data: "Nenhum dado encontrado"
    });
  }
}


/*É PRECISO HABILITAR A API DO GOOGLE+ NO CONSOLE DO GOOGLE*/
function login(req, res, next) {
  console.log("------------------Login----------------------");
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
          req.params.usuNome = gData['name'];
          req.params.usuEmail = gData['email'];
          req.params.usuImagem = gData['picture'];
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

/**
Método que valida o token recebido no cabeçalho da requisição.

Ao validar o token, verifica se o usuário está cadastrado no banco de dados.
  ->Caso estiver, seta o parametro req.params.usuCodigo com o codigo do usuario
no banco de dados.
  ->Caso nao estiver cadastrado, retorna mensagem que necessita de cadastro.
*/
function validaToken(req, res, next) {
  console.log("------------------validaToken----------------");
  try {
    var id_token = req.headers['idtoken'];
    if (id_token === undefined) {
      return res.status(500).json({
        error: true,
        data: "É preciso fazer login para acessar esta área!"
      });
    }
    var url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' +
      id_token;
    https.get(url, (resposta) => {
      resposta.on('data', (d) => {
        // console.log('statusCodeGoogle:', resposta.statusCode);
        let gData = JSON.parse(d);
        req.params.usuIdGoogle = gData['sub'];
        //console.log(gData);
        if (resposta.statusCode === 200) {
          usuModel.Usuario.where({
              'usuIdGoogle': gData['sub']
            })
            .fetch()
            .then(function(user) {
              if (user) {
                let usuario = user.toJSON();
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
          console.log(gData);
          res.status(resposta.statusCode).json({
            error: true,
            data: gData['error_description']
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
      data: err
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
