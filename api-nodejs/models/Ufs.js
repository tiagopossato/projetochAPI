"use strict";
let bookshelf = require('bookshelf')(require('../models/banco'));
let Cidade = require('../models/Cidades').Cidade;

let Uf = bookshelf.Model.extend({
  tableName: 'UF',
  cidades: function () {
    return this.hasMany(Cidade, 'ufCodigo');
  }
});

let Ufs = bookshelf.Collection.extend({
  model: Uf
});

module.exports = {Uf, Ufs};
