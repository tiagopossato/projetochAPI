"use strict";
let bookshelf = require('bookshelf')(require('../models/banco'));
bookshelf.plugin('visibility');
let Cidade = require('../models/Cidade');
let moment = require('moment-timezone');

let Endereco = bookshelf.Model.extend({
	tableName: 'ENDERECO',
	idAttribute: 'endCodigo',
        created_at: 'endCreatedAt',
	//hidden: ['endUpdatedAt', 'endCreatedAt'],
	cidade: function(){
		return this.hasOne(Cidade, 'cidCodigo');
	},
});

//let Enderecos = bookshelf.Collection.extend({
//  model: Endereco
//});

module.exports = Endereco;
