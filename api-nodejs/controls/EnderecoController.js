"use strict";
var banco = require('../models/banco');
var moment = require('moment-timezone');
var Endereco = require('../models/Endereco');

module.exports = {
    get: getEnderecos,
    getById: getEnderecoById,
    post: postEndereco
};

function getEnderecos(req, res) {
    Endereco.forge()
            .fetchAll()
            .then(function (cidades) {
                res.status(200).json({error: false, data: cidades.toJSON()});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
}

function getEnderecoById(req, res) {
    // Grab data from the URL parameters
    enderecoById(req.params.id, res);
}

function enderecoById(id, res) {
    Endereco.where({endCodigo: id})
            .fetch()
            .then(function (enderecos) {
                res.status(200).json({error: false, data: enderecos.toJSON()});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err}});
            });
}

function postEndereco(req, res) {

    var data = moment().tz("America/Sao_Paulo").format();

    var dados = {
        endLogradouro: req.body.endLogradouro,
        endBairro: req.body.endBairro,
        endNumero: req.body.endNumero,
        cidCodigo: req.body.cidCodigo,
        endLatitute: req.body.endLatitute,
        endLongitude: req.body.endLongitude,
        endCreatedAt: data,
        endUpdatedAt: data
    };

//console.log(dados);

    Endereco.forge(dados)
            .save()
            .then(function (endereco) {
                enderecoById(endereco.get('endCodigo'), res);
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
}
