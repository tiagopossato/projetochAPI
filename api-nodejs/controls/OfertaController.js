"use strict";
let banco = require('../models/banco');
let Oferta = require('../models/Oferta');

module.exports = {
  get: getOfertas,
  getById: getOfertasById
    // novo: novoEndereco,
    // apaga: apagaEndereco
};

function getOfertas(req, res) {
  banco('OFERTA')
    .join('USUARIO', 'USUARIO.usuCodigo', '=', 'OFERTA.usuCodigo')
    .select('OFERTA.oftCodigo', 'OFERTA.itmCodigo', 'OFERTA.oftDataFinal',
      'OFERTA.oftImagem', 'USUARIO.usuIdGoogle')
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
      res.status(500).json({
        error: true,
        data: {
          message: err.message
        }
      });
    });
}

function getOfertasById(req, res) {
  var oftCodigo = req.params.id;
  banco('OFERTA')
    .where('oftCodigo', '=', oftCodigo)
    .join('ENDERECO', 'OFERTA.endCodigo', '=', 'ENDERECO.endCodigo')
    .select('OFERTA.oftQuantidade', 'OFERTA.oftValor', 'OFERTA.oftDataInicial',
      'ENDERECO.endCep',
      'ENDERECO.endLogradouro',
      'ENDERECO.endBairro',
      'ENDERECO.endNumero',
      'ENDERECO.cidCodigo',
      'ENDERECO.ufCodigo',
      'ENDERECO.endLatitude',
      'ENDERECO.endLongitude')
    .then(function(response) {
      console.log(response);
      //deleta as propriedades nulas
      for (var k in response[0]) {
        console.log(k);
        if (response[0][k] == null) {
          delete response[0][k];
        }
      }

      res.status(200).json({
        error: false,
        data: response[0]
      });
    })
    .catch(function(error) {
      res.status(500).json({
        error: true,
        data: {
          message: error.message
        }
      });
    });

}
//
// function enderecoById(id, res) {
//   Endereco.where({
//       endCodigo: id
//     })
//     .fetch()
//     .then(function(enderecos) {
//       res.status(200).json({
//         error: false,
//         data: enderecos.toJSON()
//       });
//     })
//     .catch(function(err) {
//       res.status(500).json({
//         error: true,
//         data: {
//           message: err
//         }
//       });
//     });
// }
//
// /**
// Recebe os objetos de requisição, resposta e a uma função de callback
// Cria um novo endereço e chama a função next, passando esse endereço como um dos
// parâmetros da requisicao
// */
// function novoEndereco(req, res, callback) {
//   var dados = req.query['endereco'];
//   if (!dados) {
//     console.log(
//       'novoEndereco: dados não definidos, verifique se estão vindo via req.query!'
//     );
//   }
//   Endereco.forge(dados)
//     .save()
//     .then(function(endereco) {
//       req.params.endereco = endereco;
//       callback(req, res);
//     })
//     .catch(function(err) {
//       res.status(500).json({
//         error: true,
//         data: err.message
//       });
//     });
// }
//
// function apagaEndereco() {
//
//   banco("ENDERECO")
//     .del()
//     .where({
//
//     })
//     .then(function(count) {
//       console.log(count);
//     }).finally(function() {
//       //banco.destroy();
//     });
//   return;
//
//   Endereco.forge({
//       'endCodigo': endCodigo
//     })
//     .fetch()
//     .then(function(endereco) {
//       endereco.destroy()
//         .then(function() {
//           console.log('Endereco apagado com sucesso!');
//         })
//         .catch(function(err) {
//           console.log('Endereco não pode ser apagado: \n' + console.log(
//             JSON.stringify(err)));
//         });
//     })
//     .catch(function(err) {
//       console.log('Apaga endereco: \n' + console.log(
//         JSON.stringify(err)));
//     });
// }
