"use strict";
let bookshelf = require('bookshelf')(require('../models/banco'));
var Uf = require('../models/Ufs').Uf;

let Cidade = bookshelf.Model.extend({
	tableName: 'CIDADE',
	idAttribute: 'cidCodigo',
	uf: function(){
		return this.hasOne(Uf, 'ufCodigo');
	},
//	  enderecos: function () {
//	    return this.hasMany(Endereco, 'cidCodigo');
//	  }
});

let Cidades = bookshelf.Collection.extend({
  model: Cidade
});

module.exports = {Cidade,Cidades};
