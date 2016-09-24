var Usuario = require('../models/Usuario');

module.exports = {
    login: getUsuarioByGoogleId
    };

function getUsuarioByGoogleId(req, res) {
    // Grab data from the URL parameters
    var id = req.params.id;

    Usuario.where({usuIdGoogle: id})
            .fetch()
            .then(function (usuario) {
                res.status(200).json({error: false, data: usuario.toJSON()});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
}
