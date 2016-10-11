"use strict";
let banco = require('../models/banco');
let moment = require('moment-timezone');
let Endereco = require('../models/Endereco');

module.exports = {
  //get: getEnderecos,
  getById: getEnderecoById,
  novo: novoEndereco
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
function novoEndereco(req, res, callback) {
  // var data = moment().tz("America/Sao_Paulo").format();
  var dados = req.query['endereco'];
  if (!dados) {
    console.log(
      'novoEndereco: dados não definidos, verifique se estão vindo via req.query!'
    );
  }
  Endereco.forge(dados)
    .save()
    .then(function(endereco) {
      req.params.endereco = endereco;
      callback(req, res);
    })
    .catch(function(err) {
      res.status(500).json({
        error: true,
        data: err.message
      });
    });
}
