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

    connection.connect(function(err) {
        //caso deu erro
        if (err) {
            console.log('Error connecting to Db');
            console.log(err);
            //encerra a conexão
            connection.end(function(err) {
                if (err) {
                    console.log('Erro ao fechar a conexão');
                }
            });
            return res.status(500).json({
                success: false,
                data: err
            });
        }
        //caso conectou
        connection.query('SELECT CID_CODIGO, CID_NOME, UF_CODIGO FROM cidades ORDER BY CID_NOME ASC;',
            function(err, rows, fields) {
                //encerra a conexão
                connection.end(function(err) {
                    if (err) {
                        console.log('Erro ao fechar a conexão');
                    }
                });
                
                //verifica os resultados
                if (!err) {
                    return res.json(rows);
                }
                else {
                    return res.status(500).json({
                        success: false,
                        data: 'Error while performing Query.'
                    });
                }
            });
    });

}

function getCidadeById(req, res) {}

function postCidade(req, res) {}

function putCidade(req, res) {}

function deleteCidade(req, res) {}
/*

function getCidadeById(req, res) {
    var results = [];
    // Grab data from the URL parameters
    var id = req.params.id;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({
                success: false,
                data: err
            });
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM cidades WHERE id=$1;", [id]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });

    });

}


function postCidade(req, res) {

    var results = [];

    // Grab data from http request
    var data = {
        nome: req.body.nome,
        uf: req.body.uf
    };

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({
                success: false,
                data: err
            });
        }
        // SQL Query > Insert Data
        client.query("INSERT INTO cidades(nome, uf, created_at, updated_at) values($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)", [data.nome, data.uf]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM cidades ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
}

function putCidade(req, res) {
    var results = [];

    // Grab data from the URL parameters
    var id = req.params.id;

    // Grab data from http request
    var data = {
        nome: req.body.nome,
        uf: req.body.uf
    };

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).send(json({
                success: false,
                data: err
            }));
        }

        // SQL Query > Update Data
        client.query("UPDATE cidades SET nome=($1), uf=($2), updated_at=CURRENT_TIMESTAMP WHERE id=($3)", [data.nome, data.uf, id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM cidades ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

}

function deleteCidade(req, res) {
    var results = [];

    // Grab data from the URL parameters
    var id = req.params.id;

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({
                success: false,
                data: err
            });
        }

        // SQL Query > Delete Data
        client.query("DELETE FROM cidades WHERE id=($1)", [id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM cidades ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

}


*/