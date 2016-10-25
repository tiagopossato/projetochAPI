"use strict";
let bookshelf = require('bookshelf')(require('../models/banco'));
bookshelf.plugin('visibility');
let Usuario = require('../models/Usuario');
let Endereco = require('../models/Endereco');


let Oferta = bookshelf.Model.extend({
	tableName: 'OFERTA',
	idAttribute: 'oftCodigo',
	hidden: ['oftUpdatedAt', 'oftCreatedAt'],
	usuario: function() {
		return this.belongsTo(Usuario, 'usuCodigo');
	},
	endereco: function() {
		return this.belongsTo(Endereco, 'endCodigo');
	}
});

module.exports = Oferta;
