"use strict";
let banco = require('../models/banco');
let Oferta = require('../models/Oferta');

module.exports = {
  //get: getEnderecos,
  getById: getEnderecoById,
  novo: novoEndereco,
  apaga: apagaEndereco
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

function apagaEndereco() {

  banco("ENDERECO")
    .del()
    .where({

    })
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
