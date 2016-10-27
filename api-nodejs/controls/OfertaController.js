"use strict";
let banco = require('../models/banco');
let Oferta = require('../models/Oferta');
var Endereco = require('../controls/EnderecoController');

module.exports = {
  get: getOfertas,
  getById: getOfertasById,
  post: novaOferta
    // apaga: apagaEndereco
};

function getOfertas(req, res) {
  var preferencias = req.query;
  if (preferencias.dataVencimento == undefined) {
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
    //console.log(preferencias);
    //ver http: //knexjs.org/#Raw-Queries
    banco('OFERTA')
      .join('USUARIO', 'USUARIO.usuCodigo', '=', 'OFERTA.usuCodigo')
      .select('OFERTA.oftCodigo', 'OFERTA.itmCodigo', 'OFERTA.oftDataFinal',
        'OFERTA.oftImagem', 'USUARIO.usuIdGoogle')
      .whereIn('OFERTA.itmCodigo', preferencias.itens)
      .where('OFERTA.oftDataFinal', '<=',
        preferencias.dataVencimento)
      .limit(parseInt(preferencias.offset['qtd']))
      .offset(parseInt(preferencias.offset['inicio']))
      .then(function(ofertas) {
        //			console.log(response);
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
        res.status(200).json({
          error: false,
          data: resposta
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
    //console.log(preferencias);
    //ver http: //knexjs.org/#Raw-Queries
    banco('OFERTA')
      .join('USUARIO', 'USUARIO.usuCodigo', '=', 'OFERTA.usuCodigo')
      .select('OFERTA.oftCodigo', 'OFERTA.itmCodigo', 'OFERTA.oftDataFinal',
        'OFERTA.oftImagem', 'USUARIO.usuIdGoogle')
      .where('OFERTA.oftDataFinal', '<=',
        preferencias.dataVencimento)
      .limit(parseInt(preferencias.offset['qtd']))
      .offset(parseInt(preferencias.offset['inicio']))
      .then(function(ofertas) {
        //			console.log(response);
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
        res.status(200).json({
          error: false,
          data: resposta
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
      'OFERTA.usuCodigo',
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
        oftDataInicial: response[0]['oftDataInicial'],
        oftDataFinal: response[0]['oftDataFinal'],
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

function novaOferta(req, res) {
  console.log("\t-> novaOferta");
  //  console.log('req.query:' + JSON.stringify(req.query));

  // var oferta = req.query;
  // var endereco = oferta.endereco;
  // delete oferta.endereco;
  // console.log('oferta:' + JSON.stringify(oferta));
  // console.log("endereco:" + JSON.stringify(endereco));

  //verifica endereço e
  //chama a primeira função caso o endereco já está cadastrado no banco
  //chama a segunda função caso o endereço não esteja cadastrado
  Endereco.verifica(req.query['endCodigo'], req, res, function(req, res) {
    var oferta = req.query;
    //var endereco = oferta.endereco;
    //apaga o objeto endereço da oferta, mantendo somente o endCodigo
    delete oferta.endereco;
    //deleta as propriedades nulas
    for (var k in oferta) {
      if (oferta[k] == "") {
        delete oferta[k];
      }
    }
    console.log('oferta:' + JSON.stringify(oferta));
    Oferta.forge(oferta)
      .save()
      .then(function(oferta) {
        console.log("\t-> Nova Oferta");
        res.status(200).json({
          error: false
        });
      })
      .catch(function(err) {
        console.log('novaOferta: ' + JSON.stringify(err));
        res.status(500).json({
          error: true,
          data: err.message
        });
      });
  }, function(req, res) {
    var endereco = req.query.endereco;
    Endereco.novo(endereco, req, res, function(req, res) {
      var endereco = req.params.endereco.toJSON();
      var oferta = req.query;
      //var endereco = oferta.endereco;
      //apaga o objeto endereço da oferta, mantendo somente o endCodigo
      delete oferta.endereco;
      oferta['endCodigo'] = endereco['endCodigo'];
      //console.log('oferta:' + JSON.stringify(oferta));
      Oferta.forge(oferta)
        .save()
        .then(function(oferta) {
          console.log("\t-> Nova Oferta");
          res.status(200).json({
            error: false
          });
        })
        .catch(function(err) {
          console.log('novaOferta: ' + JSON.stringify(err));
          res.status(500).json({
            error: true,
            data: err.message
          });
        });
    });
  });
}
