var banco = require('knex')({
    client: 'mysql',
    connection: {
        host: '104.236.59.135',
        user: 'chucrute-testes',
        password: 'chucrute-testes',
        database: 'TESTES-HORTAPP',
        charset: 'utf8'
    },
    useNullAsDefault: true
});

module.exports = {
    get: getEnderecos,
    getById: getEnderecoById,
    post: postEndereco
};

function getEnderecos(req, res) {
    banco
            .select('*')
            .from('ENDERECO')
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

function getEnderecoById(req, res) {
    // Grab data from the URL parameters
    enderecoById(req.params.id, res);
}

function enderecoById(id, res) {
    //console.log("ID: "+id);
    banco
            .select('*')
            .from('ENDERECO')
            .where({END_CODIGO: id})
//            .on('query-response', function (response, obj, builder) {
//            })
            .then(function (response) {
                // Same response as the emitted event
                //console.log(response);
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

function postEndereco(req, res) {

    /*  EXEMPLO DA DOCUMENTACAO
     * knex('coords').insert([{x: 20}, {y: 30}, {x: 10, y: 20}])
     * insert into `coords` (`x`, `y`) values (20, NULL), (NULL, 30), (10, 20)"
     */
    var dados = {
        endLogradouro: req.body.endLogradouro,
        endBairro: req.body.endBairro,
        endNumero: req.body.endNumero,
        cidCodigo: req.body.cidCodigo,
        endLatitute: req.body.endLatitute,
        endLongitude: req.body.endLongitude,
        endCreatedAt: 'NOW()',
        endUpdatedAt: 'NOW()'
    };
    banco.
            insert(dados)
            .into("ENDERECO")
            .returning('endCodigo')
            .then(function (id) {
                enderecoById(id, res);
            });
}