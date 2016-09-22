"use strict";
let banco = require('../models/banco');
let Uf = require('../models/Ufs');
let Cidade = require('../models/Cidades').Cidade;
let Cidades = require('../models/Cidades').Cidades;

module.exports = {
    get: getCidades,
    getById: getCidadeById,
    getByUfId: getCidadeByUfId
};

function getCidades(req, res) {
    banco
            .select('cidCodigo', 'cidNome', 'ufCodigo')
            .from('CIDADE')
//            .on('query-response', function (response, obj, builder) {             
//            })
            .then(function (response) {
                // Same response as the emitted event
                return res.status(200).json({
                    success: true,
                    data: response
                });
            })
            .catch(function (error) {
                return res.status(500).json({
                    success: false,
                    data: error
                });
            });
}

function getCidadeById(req, res) {
    // Grab data from the URL parameters
    let id = req.params.id;

 	Cidade.forge({cidCodigo: id})
    .fetch()
    .then(function (cidade) {
      if (!cidade) {
	//console.log('Nada');
        res.status(404).json({error: true, data: {}});
      }
      else {
	//console.log('Achou');
	//console.log(cidade.toJSON());
        res.status(200).json({error: false, data: cidade.toJSON()});
      }
    })
    .catch(function (err) {
	//console.log(err.message)
    res.status(500).json({error: true, data: {message: err.message}});
    });
/*
    banco
            .select('cidCodigo', 'cidNome', 'ufCodigo')
            .from('CIDADE')
            .where({cidCodigo: id})
//            .on('query-response', function (response, obj, builder) {                
//            })
            .then(function (response) {
                // Same response as the emitted event
                return res.status(200).json({
                    success: true,
                    data: response
                });
            })
            .catch(function (error) {
                return res.status(500).json({
                    success: false,
                    data: error
                });
            });
*/
}

function getCidadeByUfId(req, res) {
    // Grab data from the URL parameters
    let id = req.params.id;

	Uf.Uf.where({ufCodigo: id})
	.fetch({withRelated: ['cidades']})
	.then(function(cidades) {
		console.log(JSON.stringify(cidades.related('ufs')));
    	res.status(200).json({error: false, data: cidades.toJSON()});
	})    
	.catch(function (err) {
		res.status(500).json({error: true, data: {message: err.message}});
	});

/*
    Uf.Uf.forge({ufCodigo: id})
    .fetch({withRelated: ['cidades']})
    .then(function (cidades) {
      let cidades = cidades.related('cidades');
      res.json({error: false, data: cidades.toJSON()});
    })
    .catch(function (err) {
	res.status(500).json(
		{error: true, data: {message: err.message}});
	});
*/

/*
// select * from `books` where author_id = 1
Author
	.where({id: 1})
	.fetch({withRelated: ['books']})
	.then(function(author) {
		console.log(JSON.stringify(author.related('books')));
	});
*/
}
