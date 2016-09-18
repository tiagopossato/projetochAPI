var banco = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'chucrute-testes',
        password: 'chucrute-testes',
        database: 'TESTES-HORTAPP',
        charset: 'utf8'
    }
});
module.exports = {
    get: getCidades,
    getById: getCidadeById
};

function getCidades(req, res) {
    banco
            .select('*')
            .from('cidade')
            .on('query-response', function (response, obj, builder) {                
            })
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

function getCidadeById(req, res) {
    // Grab data from the URL parameters
    var id = req.params.id;
    banco
            .select('*')
            .from('cidade')
            .where({CID_CODIGO: id})    
            .on('query-response', function (response, obj, builder) {                
            })
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