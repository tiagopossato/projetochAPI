"use strict";
let banco = require('../models/banco');
let moment = require('moment-timezone');
let Endereco = require('../models/Endereco');

module.exports = {
  //get: getEnderecos,
  getById: getEnderecoById,
  novo: novoEndereco,
  apaga: apagaEndereco,
  verifica: verificaEndereco
};

function getEnderecos(req, res) {
  Endereco.forge()
    .fetchAll()
    .then(function(cidades) {
      res.status(200).json({
        error: false,
        data: cidades.toJSON()
      });
    })
    .catch(function(err) {
      res.status(500).json({
        error: true,
        data: {
          message: err.message
        }
      });
    });
}

function getEnderecoById(req, res) {
  // Grab data from the URL parameters
  enderecoById(req.params.id, res);
}

function enderecoById(id, res) {
  Endereco.where({
      endCodigo: id
    })
    .fetch()
    .then(function(enderecos) {
      //deleta as propriedades nulas
      for (var k in enderecos || enderecos[k] == "") {
        if (enderecos[k] == null) {
          delete enderecos[k];
        }
      }
      res.status(200).json({
        error: false,
        data: enderecos.toJSON()
      });
    })
    .catch(function(err) {
      res.status(500).json({
        error: true,
        data: {
          message: err
        }
      });
    });
}

/**
Recebe os objetos de requisição, resposta e a uma função de callback
Cria um novo endereço e chama a função next, passando esse endereço como um dos
parâmetros da requisicao
*/
function novoEndereco(dados, req, res, next) {
  // var data = moment().tz("America/Sao_Paulo").format();
  Endereco.forge(dados)
    .save()
    .then(function(endereco) {
      req.params.endereco = endereco;
      next(req, res);
    })
    .catch(function(err) {
      res.status(500).json({
        error: true,
        data: err.message
      });
    });
}

function apagaEndereco() {
  banco("ENDERECO")
    .del()
    .where({})
    .then(function(count) {
      console.log(count);
    }).finally(function() {
      //banco.destroy();
    });
  return;

  Endereco.forge({
      'endCodigo': endCodigo
    })
    .fetch()
    .then(function(endereco) {
      endereco.destroy()
        .then(function() {
          console.log('Endereco apagado com sucesso!');
        })
        .catch(function(err) {
          console.log('Endereco não pode ser apagado: \n' + console.log(
            JSON.stringify(err)));
        });
    })
    .catch(function(err) {
      console.log('Apaga endereco: \n' + console.log(
        JSON.stringify(err)));
    });
}

function verificaEndereco(id, req, res, valido, invalido) {
  Endereco.where({
      endCodigo: id
    })
    .fetch()
    .then(function(enderecos) {
      //console.log('Endereco Valido');
      valido(req, res);
    })
    .catch(function(err) {
      //console.log('Endereco invalido');
      invalido(req, res);
    });
}
