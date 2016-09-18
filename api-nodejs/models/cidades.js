var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'chucrute',
    password: 'chucrute',
    database: 'HORTAPP'
});

module.exports = {
    get: getCidades,
    getById: getCidadeById,
    post: postCidade,
    put: putCidade,
    delete: deleteCidade
};

function getCidades(req, res) {
    var results = [];
    // https://github.com/mysqljs/mysql#streaming-query-rows
    var query = connection.query('SELECT CID_CODIGO, CID_NOME, UF_CODIGO FROM cidade ORDER BY CID_NOME ASC;');
    query
        .on('error', function(err) {
            // Handle error, an 'end' event will be emitted after this as well
            console.log(err);
        })
        .on('fields', function(fields) {
            // the field packets for the rows to follow
            console.log("Field: "+fields);
            //results.push(fields);
        })
        .on('result', function(row) {
            // Pausing the connnection is useful if your processing involves I/O
            console.log("Row:" +row);
            //connection.pause();

            //processRow(row, function() {
           //     connection.resume();
           // });
        })
        .on('end', function() {
            // all rows have been received
            connection.end(function(err) {
                if (err) {
                    console.log('Erro ao fechar a conexão');
                }
            });
            return res.json(results);
        });
}

function getCidadeById(req, res) {}

function postCidade(req, res) {}

function putCidade(req, res) {}

function deleteCidade(req, res) {}