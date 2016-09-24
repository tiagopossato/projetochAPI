"use strict";
let bookshelf = require('bookshelf')(require('../models/banco'));
let Cidade = require('../models/Cidade');

var Uf = bookshelf.Model.extend({
  tableName: 'UF',
  idAttribute: 'ufCodigo',
  cidades: function () {
    return this.hasMany(Cidade, 'cidCodigo');
  },
	cidade: function () {
    return this.belongsToMany(Cidade, 'ufCodigo');
  },
});

//let Ufs = bookshelf.Collection.extend({
//  model: Uf
//});

module.exports = Uf;
