"use strict";
let bookshelf = require('bookshelf')(require('../models/banco'));
let Cidade = require('../models/Cidades').Cidade;

var Uf = bookshelf.Model.extend({
  tableName: 'UF',
  idAttribute: 'ufCodigo',
  cidades: function () {
    return this.hasMany(Cidade, 'ufCodigo');
  },
	cidade: function () {
    return this.belongsToMany(Cidade, 'ufCodigo');
  },
});

var Ufs = bookshelf.Collection.extend({
  model: Uf
});

module.exports = {Uf, Ufs};
