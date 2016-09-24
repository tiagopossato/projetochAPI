"use strict";
var banco = require('../models/banco');
var Uf = require('../models/Uf').Uf;
var Cidade = require('../models/Cidade');

module.exports = {
    get: getCidades,
    getById: getCidadeById,
    getByUfId: getCidadeByUfId
};

function getCidades(req, res) {
    Cidade.forge()
            .fetchAll()
            .then(function (cidades) {
                res.status(200).json({error: false, data: cidades.toJSON()});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
}

function getCidadeById(req, res) {
    // Grab data from the URL parameters
    var id = req.params.id;

    Cidade.where({cidCodigo: id})
            .fetch()
            .then(function (cidades) {
                //console.log(JSON.stringify(cidades.related('cidades')));
                res.status(200).json({error: false, data: cidades.toJSON()});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
}

function getCidadeByUfId(req, res) {
    // Grab data from the URL parameters
    var id = req.params.id;
    Uf.where({ufCodigo: id})
            .fetch({withRelated: ['cidades']})
            .then(function (cidades) {
                //console.log(JSON.stringify(cidades.related('cidades')));
                res.status(200).json({error: false, data: cidades.toJSON()});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
}
