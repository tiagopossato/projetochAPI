"use strict";
let bookshelf = require('bookshelf')(require('../models/banco'));
bookshelf.plugin('visibility');
let Endereco = require('../models/Endereco');

/*`USUARIO`{
	`usuCodigo`,
  `usuIdGoogle`,
  `endCodigo`,
  `usuEndVisivel`,
  `usuTelefone`,
  `usuTelefoneVisivel`,
  `usuUpdatedAt`,
  `usuCreatedAt`
}*/
let Usuario = bookshelf.Model.extend({
	tableName: 'USUARIO',
	idAttribute: 'usuCodigo',
	hidden: ['usuUpdatedAt', 'usuCreatedAt'],
	endereco: function(){
		return this.hasOne(Endereco, 'endCodigo');
	}
});

//let Cidades = bookshelf.Collection.extend({
//  model: Cidade
//});

module.exports = Usuario;
