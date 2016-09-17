// var pg = require('pg');
// var connectionString = 'postgres://chucrute:chucrute@localhost/chucrute';

module.exports = {
    //get: getCidades,
    //getById: getCidadeById,
    post: postUsuario,
    // put: putCidade,
    //delete: deleteCidade
};

// function getCidades(req, res) {
//     var results = [];

//     // Get a Postgres client from the connection pool
//     pg.connect(connectionString, function(err, client, done) {
//         // Handle connection errors
//         if (err) {
//             done();
//             console.log(err);
//             return res.status(500).json({
//                 success: false,
//                 data: err
//             });
//         }

//         // SQL Query > Select Data
//         var query = client.query("SELECT id, nome,uf FROM cidades WHERE isativo = TRUE ORDER BY id ASC;");

//         // Stream results back one row at a time
//         query.on('row', function(row) {
//             results.push(row);
//         });

//         // After all data is returned, close connection and return results
//         query.on('end', function() {
//             done();
//             return res.json(results);
//         });

//     });
// }

// function getCidadeById(req, res) {
//     var results = [];
//     // Grab data from the URL parameters
//     var id = req.params.id;

//     // Get a Postgres client from the connection pool
//     pg.connect(connectionString, function(err, client, done) {
//         // Handle connection errors
//         if (err) {
//             done();
//             console.log(err);
//             return res.status(500).json({
//                 success: false,
//                 data: err
//             });
//         }

//         // SQL Query > Select Data
//         var query = client.query("SELECT * FROM cidades WHERE id=$1;", [id]);

//         // Stream results back one row at a time
//         query.on('row', function(row) {
//             results.push(row);
//         });

//         // After all data is returned, close connection and return results
//         query.on('end', function() {
//             done();
//             return res.json(results);
//         });

//     });

// }


function postUsuario(req, res) {

    var results = [];

    console.log(req);
    return res.status(200);

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

// function putCidade(req, res) {
//     var results = [];

//     // Grab data from the URL parameters
//     var id = req.params.id;

//     // Grab data from http request
//     var data = {
//         nome: req.body.nome,
//         uf: req.body.uf
//     };

//     // Get a Postgres client from the connection pool
//     pg.connect(connectionString, function(err, client, done) {
//         // Handle connection errors
//         if (err) {
//             done();
//             console.log(err);
//             return res.status(500).send(json({
//                 success: false,
//                 data: err
//             }));
//         }

//         // SQL Query > Update Data
//         client.query("UPDATE cidades SET nome=($1), uf=($2), updated_at=CURRENT_TIMESTAMP WHERE id=($3)", [data.nome, data.uf, id]);

//         // SQL Query > Select Data
//         var query = client.query("SELECT * FROM cidades ORDER BY id ASC");

//         // Stream results back one row at a time
//         query.on('row', function(row) {
//             results.push(row);
//         });

//         // After all data is returned, close connection and return results
//         query.on('end', function() {
//             done();
//             return res.json(results);
//         });
//     });

// }

// function deleteCidade(req, res) {
//     var results = [];

//     // Grab data from the URL parameters
//     var id = req.params.id;

//     // Get a Postgres client from the connection pool
//     pg.connect(connectionString, function(err, client, done) {
//         // Handle connection errors
//         if (err) {
//             done();
//             console.log(err);
//             return res.status(500).json({
//                 success: false,
//                 data: err
//             });
//         }

//         // SQL Query > Delete Data
//         client.query("DELETE FROM cidades WHERE id=($1)", [id]);

//         // SQL Query > Select Data
//         var query = client.query("SELECT * FROM cidades ORDER BY id ASC");

//         // Stream results back one row at a time
//         query.on('row', function(row) {
//             results.push(row);
//         });

//         // After all data is returned, close connection and return results
//         query.on('end', function() {
//             done();
//             return res.json(results);
//         });
//     });

// }