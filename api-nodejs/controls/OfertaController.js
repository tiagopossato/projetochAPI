"use strict";
let banco = require('../models/banco');
let Oferta = require('../models/Oferta');
let Endereco = require('../controls/EnderecoController');
let strtotime = require('strtotime');
let formidable = require('formidable');
let fs = require('fs');
let mv = require('mv');

Date.prototype.formatMMDDYYYY = function() {
  return this.getDate() +
    "/" + (this.getMonth() + 1) +
    "/" + this.getFullYear();
}

module.exports = {
  get: getOfertas,
  getById: getOfertasById,
  post: novaOferta,
  put: updateOferta,
  recebeFoto: recebeFoto,
  minhasOfertas: getMinhasOfertas
};

function getOfertas(req, res) {
  var preferencias = req.query;
  console.log(preferencias);
  if (preferencias.dataVencimento == undefined ||
    preferencias.offset == undefined) {
    preferencias = {
      //"distancia": "XX",
      "dataVencimento": "31/12/2080",
      // "itens": [],
      "offset": {
        "inicio": 0,
        "qtd": 100
      }
    };
  }

  if (preferencias.itens && preferencias.itens.length > 0) {
    //ver http: //knexjs.org/#Raw-Queries
    banco('OFERTA')
      .join('USUARIO', 'USUARIO.usuCodigo', '=', 'OFERTA.usuCodigo')
      .select('OFERTA.oftCodigo', 'OFERTA.itmCodigo', 'OFERTA.oftDataFinal',
        'OFERTA.oftQuantidade', 'OFERTA.oftImagem', 'USUARIO.usuIdGoogle')
      .whereIn('OFERTA.itmCodigo', preferencias.itens)
      .where('OFERTA.oftDataFinal', '<=',
        preferencias.dataVencimento)
      .limit(parseInt(preferencias.offset['qtd']))
      .offset(parseInt(preferencias.offset['inicio']))
      .then(function(ofertas) {

        for (var i = 0; i < ofertas.length; i++) {
          try {
            ofertas[i]['oftDataFinal'] = ofertas[i]['oftDataFinal'].formatMMDDYYYY();
          } catch (e) {
            console.log(e);
          }
        }
        //console.log(response);
        //conta a quantidade de ofertas por usuário
        /*
        var quantidades = {};
        for (var i = 0; i < ofertas.length; i++) {
          if (!quantidades[ofertas[i]['usuIdGoogle']])
            quantidades[ofertas[i]['usuIdGoogle']] = 1;
          else
            quantidades[ofertas[i]['usuIdGoogle']]++;
        }
        var resposta = {
          ofertas, quantidades
        };
				*/
        res.status(200).json({
          error: false,
          data: ofertas
        });
      })
      .catch(function(error) {
        //console.log(error.message);
        res.status(500).json({
          error: true,
          data: {
            message: error.message
          }
        });
      })
      .debug();
  } else {

    //ver http: //knexjs.org/#Raw-Queries
    banco('OFERTA')
      .join('USUARIO', 'USUARIO.usuCodigo', '=', 'OFERTA.usuCodigo')
      .select('OFERTA.oftCodigo', 'OFERTA.itmCodigo', 'OFERTA.oftDataFinal',
        'OFERTA.oftQuantidade', 'OFERTA.oftImagem', 'USUARIO.usuIdGoogle')
      .where('OFERTA.oftDataFinal', '<=',
        preferencias.dataVencimento)
      .limit(parseInt(preferencias.offset['qtd']))
      .offset(parseInt(preferencias.offset['inicio']))
      .then(function(ofertas) {
        for (var i = 0; i < ofertas.length; i++) {
          try {
            ofertas[i]['oftDataFinal'] = ofertas[i]['oftDataFinal'].formatMMDDYYYY();
          } catch (e) {
            console.log(e);
          }
        }
        //console.log(ofertas);
        //conta a quantidade de ofertas por usuario
        // var quantidades = {};
        // for (var i = 0; i < ofertas.length; i++) {
        //   if (!quantidades[ofertas[i]['usuIdGoogle']])
        //     quantidades[ofertas[i]['usuIdGoogle']] = 1;
        //   else
        //     quantidades[ofertas[i]['usuIdGoogle']]++;
        // }
        // var resposta = {
        //   ofertas, quantidades
        // };
        res.status(200).json({
          error: false,
          data: ofertas
        });
      })
      .catch(function(error) {
        console.log(error.message);
        res.status(500).json({
          error: true,
          data: {
            message: error.message
          }
        });
      });
  }
}

function getOfertasById(req, res) {
  var oftCodigo = req.params.id;
  banco('OFERTA')
    .where('oftCodigo', '=', oftCodigo)
    .join('ENDERECO', 'OFERTA.endCodigo', '=', 'ENDERECO.endCodigo')
    .select('OFERTA.oftCodigo',
      'OFERTA.itmCodigo',
      // 'OFERTA.usuCodigo',
      'OFERTA.oftDataFinal',
      'OFERTA.oftImagem',
      'OFERTA.oftQuantidade',
      'OFERTA.oftValor',
      'OFERTA.oftDataInicial',
      'ENDERECO.endCodigo',
      'ENDERECO.endCep',
      'ENDERECO.endLogradouro',
      'ENDERECO.endBairro',
      'ENDERECO.endNumero',
      'ENDERECO.cidCodigo',
      'ENDERECO.ufCodigo',
      'ENDERECO.endLatitude',
      'ENDERECO.endLongitude')
    .then(function(response) {
      // console.log(response);
      if (!response[0]) {
        throw 'Nenhum registro encontrado';
      }

      var oferta = {
        oftCodigo: response[0]['oftCodigo'],
        usuCodigo: response[0]['usuCodigo'],
        itmCodigo: response[0]['itmCodigo'],
        oftQuantidade: response[0]['oftQuantidade'],
        oftValor: response[0]['oftValor'],
        oftDataInicial: response[0]['oftDataInicial'] ?
          response[0]['oftDataInicial'].formatMMDDYYYY() : "",
        oftDataFinal: response[0]['oftDataFinal'] ?
          response[0]['oftDataFinal'].formatMMDDYYYY() : "",
        endCodigo: response[0]['endCodigo'],
      };

      //deleta as propriedades nulas
      for (var k in oferta || oferta[k] == "") {
        if (oferta[k] == null) {
          delete oferta[k];
        }
      }
      var endereco = {
          endLogradouro: response[0]['endLogradouro'],
          endBairro: response[0]['endBairro'],
          endNumero: response[0]['endNumero'],
          endCep: response[0]['endCep'],
          cidCodigo: response[0]['cidCodigo'],
          ufCodigo: response[0]['ufCodigo'],
          endLatitude: response[0]['endLatitude'],
          endLongitude: response[0]['endLongitude'],
        }
        //deleta as propriedades nulas
      for (var k in endereco) {
        if (endereco[k] == null || endereco[k] == "") {
          delete endereco[k];
        }
      }

      res.status(200).json({
        error: false,
        data: {
          oferta, endereco
        }
      });
    })
    .catch(function(error) {
      console.log(error);
      res.status(500).json({
        error: true,
        data: {
          message: error.message ? error.message : error
        }
      });
    });

}

function getMinhasOfertas(req, res) {
  var usuCodigo = req.params.usuCodigo;

  banco('OFERTA')
    .select('OFERTA.oftCodigo', 'OFERTA.itmCodigo', 'OFERTA.oftDataFinal',
      'OFERTA.oftQuantidade', 'OFERTA.oftImagem')
    .where('OFERTA.usuCodigo', '=', usuCodigo)
    .then(function(ofertas) {
      for (var i = 0; i < ofertas.length; i++) {
        try {
          ofertas[i]['oftDataFinal'] = ofertas[i]['oftDataFinal'].formatMMDDYYYY();
        } catch (e) {
          console.log(e);
        }
      }
      res.status(200).json({
        error: false,
        data: ofertas
      });
    })
    .catch(function(error) {
      console.log(error.message);
      res.status(500).json({
        error: true,
        data: {
          message: error.message
        }
      });
    });
  /*
    banco('OFERTA')
      .where('usuCodigo', '=', usuCodigo)
      .join('ENDERECO', 'OFERTA.endCodigo', '=', 'ENDERECO.endCodigo')
      .select('OFERTA.oftCodigo',
        'OFERTA.itmCodigo',
        'OFERTA.oftDataFinal',
        'OFERTA.oftImagem',
        'OFERTA.oftQuantidade',
        'OFERTA.oftValor',
        'OFERTA.oftDataInicial',
        'ENDERECO.endCodigo',
        'ENDERECO.endCep',
        'ENDERECO.endLogradouro',
        'ENDERECO.endBairro',
        'ENDERECO.endNumero',
        'ENDERECO.cidCodigo',
        'ENDERECO.ufCodigo',
        'ENDERECO.endLatitude',
        'ENDERECO.endLongitude')
      .then(function(response) {
        //console.log(response);
        if (!response) {
          throw 'Nenhum registro encontrado';
        }

  			var resposta = [];

  			for(var i=0;i<response.length;i++){
  		    var oferta = {
  		      oftCodigo: response[i]['oftCodigo'],
  		      usuCodigo: response[i]['usuCodigo'],
  		      itmCodigo: response[i]['itmCodigo'],
  		      oftImagem: response[i]['oftImagem'],
  		      oftQuantidade: response[i]['oftQuantidade'],
  		      oftValor: response[i]['oftValor'],
  		      oftDataInicial: response[i]['oftDataInicial'].formatMMDDYYYY(),
  		      oftDataFinal: response[i]['oftDataFinal'].formatMMDDYYYY(),
  		      endCodigo: response[i]['endCodigo'],
  		    };

  		    //deleta as propriedades nulas
  		    for (var k in oferta || oferta[k] == "") {
  		      if (oferta[k] == null) {
  		        delete oferta[k];
  		      }
  		    }
  		    var endereco = {
  		        endLogradouro: response[i]['endLogradouro'],
  		        endBairro: response[i]['endBairro'],
  		        endNumero: response[i]['endNumero'],
  		        endCep: response[i]['endCep'],
  		        cidCodigo: response[i]['cidCodigo'],
  		        ufCodigo: response[i]['ufCodigo'],
  		        endLatitude: response[i]['endLatitude'],
  		        endLongitude: response[i]['endLongitude'],
  		      }
  		      //deleta as propriedades nulas
  		    for (var k in endereco) {
  		      if (endereco[k] == null || endereco[k] == "") {
  		        delete endereco[k];
  		      }
  		    }
  				resposta.push({oferta, endereco});
  			}

        res.status(200).json({
          error: false,
          data: resposta
        });
      })
      .catch(function(error) {
        console.log(error);
        res.status(500).json({
          error: true,
          data: {
            message: error.message ? error.message : error
          }
        });
      });
  */
}

function novaOferta(req, res) {
  console.log("\t-> novaOferta");

  //console.log('req.query:' + JSON.stringify(req.query));
  /*
  try{
  	console.log('req.query:' + JSON.stringify(req.query));
  	var oferta = req.query;
  	var endereco = oferta.endereco;
  	delete oferta.endereco;
  	console.log('oferta:' + JSON.stringify(oferta));
  	console.log("endereco:" + JSON.stringify(endereco));
  }catch(e){
  	console.log(e);
  }
  return;
  */

  //verifica endereço e
  //chama a primeira função caso o endereco já está cadastrado no banco
  //caso contrário, chama a segunda função
  Endereco.verifica(req.query['endCodigo'], req, res,
    salvaOferta,
    function(req, res) {
      var endereco = req.query['endereco'];
      console.log("endereco:" + JSON.stringify(endereco));
      Endereco.novo(endereco, req, res, function(req, res) {
        var endereco = req.params.endereco.toJSON();
        req.query['endCodigo'] = endereco['endCodigo'];
        salvaOferta(req, res);
      });
    });
}

/*SALVA OFERTA
  Salva uma oferta no banco de dados, já com o endereço criado
*/
function salvaOferta(req, res) {
  var oferta = req.query;
  //pega o id do usuario que está enviando a requisição
  oferta['usuCodigo'] = req.params.usuCodigo;
  //console.log('oferta antes do delete:' + JSON.stringify(oferta));
  //apaga o objeto endereço da oferta, mantendo somente o endCodigo
  delete oferta.endereco;
  //deleta as propriedades nulas
  for (var k in oferta) {
    if (oferta[k] == "") {
      delete oferta[k];
    }
  }
  // console.log('----------\noferta:' + JSON.stringify(oferta));
  // return res.status(200).json({
  //   error: false
  // });
  Oferta.forge(oferta)
    .save()
    .then(function(oft) {
      console.log("\t-> Nova Oferta Criada");
      var resposta = oft.toJSON();
      var oferta = {
        oftCodigo: resposta.oftCodigo
      };
      res.status(200).json({
        error: false,
        data: oferta
      });
    })
    .catch(function(err) {
      console.log('salvaOferta: ' + JSON.stringify(err));
      res.status(500).json({
        error: true,
        data: err.message
      });
    });
}

function updateOferta(req, res) {

  var endereco = req.query.endereco;

  // console.log('endereco no updateOferta:' + JSON.stringify(endereco));

  if (endereco) {
    Endereco.update(endereco, req, res, function(req, res) {
      alteraOferta(req, res)
    });
  } else {
    alteraOferta(req, res)
  }
}

function alteraOferta(req, res) {
  delete req.query.endereco;
  var oferta = req.query;
  //pega o id do usuario que está enviando a requisição
  oferta['usuCodigo'] = req.params.usuCodigo;
  Oferta.forge({
      'oftCodigo': oferta['oftCodigo']
    })
    .save(oferta)
    .then(function(ofertaAlterada) {
      //console.log('usuCodigo:' + req.params.usuCodigo);
      //console.log('req.params: ' + JSON.stringify(req.params));
      //Notificacoes.enviaNotificacao(req.params.usuIdGoogle,
      //  'Alterado com sucesso!');
      res.status(200).json({
        error: false,
        data: ofertaAlterada
      });
    })
    .catch(function(err) {
      console.log("Erro no updateOferta: " + JSON.stringify(err.message));
      res.status(500).json({
        error: true,
        data: err.message
      });
    });
}

function recebeFoto(req, res) {
  console.log("Recebendo foto");
  try {
    var form = new formidable.IncomingForm();
    var oftCodigo = req.headers['oftcodigo'];
    //console.log('oftCodigo: ' + oftCodigo);
  } catch (e) {
    console.log('new formidable.IncomingForm(): ' + e);
  }

  try {
    form.parse(req, function(err, fields, files) {

      var image = files.file,
        image_upload_path_old = image.path,
        image_upload_path_new = './public/images/',
        image_upload_name = image.name,
        image_upload_path_name = image_upload_path_new +
        image_upload_name;

      if (fs.existsSync(image_upload_path_new)) {
        mv(
          image_upload_path_old,
          image_upload_path_name,
          function(err) {
            if (err) {
              console.log('Err: ', err);
              return res.status(500).json({
                error: true,
                data: err
              });
            }
            var msg = 'Imagem ' + image_upload_name + ' salva em: ' +
              image_upload_path_new;
            console.log(msg);
            //salva caminho da imagem no banco de dados
            req.query = {
              'oftCodigo': oftCodigo,
              'oftImagem': image_upload_name,
              'endereco': null
            };
            alteraOferta(req, res);
            return;
          });
      } else {
        fs.mkdir(image_upload_path_new, function(err) {
          if (err) {
            console.log('Err: ', err);
            return res.status(500).json({
              error: true,
              data: err
            });
          }
          mv(
            image_upload_path_old,
            image_upload_path_name,
            function(err) {
              var msg = 'Imagem ' + image_upload_name +
                ' salva em: ' + image_upload_path_new;
              console.log(msg);
              //salva caminho da imagem no banco de dados
              req.query = {
                'oftCodigo': oftCodigo,
                'oftImagem': image_upload_name,
                'endereco': null
              };
              alteraOferta(req, res);
              return;
            });
        });
      }
    });
  } catch (e) {
    console.log("form.parse: " + e);
  }
}
