"use strict";
let bookshelf = require('bookshelf')(require('../models/banco'));
bookshelf.plugin('visibility');
let Uf = require('../models/Uf');

let Cidade = bookshelf.Model.extend({
	tableName: 'CIDADE',
	idAttribute: 'cidCodigo',
	hidden: ['cidUpdatedAt', 'cidCreatedAt'],
	uf: function(){
		return this.hasOne(Uf, 'ufCodigo');
	},
//	  enderecos: function () {
//	    return this.hasMany(Endereco, 'cidCodigo');
//	  }
});

//let Cidades = bookshelf.Collection.extend({
//  model: Cidade
//});

module.exports = Cidade;
