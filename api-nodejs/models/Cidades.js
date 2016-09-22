"use strict";
let bookshelf = require('bookshelf')(require('../models/banco'));
let Uf = require('../models/Ufs').Uf;

let Cidade = bookshelf.Model.extend({
	tableName: 'CIDADE',
	ufs: function(){
		return this.belongsTo(Uf, 'ufCodigo');
	}
});

let Cidades = bookshelf.Collection.extend({
  model: Cidade
});

module.exports = {Cidade,Cidades};
