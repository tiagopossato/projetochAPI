var banco = require('./models/banco');

banco('OFERTA')
	.join('USUARIO', 'USUARIO.usuCodigo', '=', 'OFERTA.usuCodigo')
	.select('OFERTA.oftCodigo', 'OFERTA.itmCodigo', 'OFERTA.oftDataFinal',
		'OFERTA.oftImagem', 'USUARIO.usuIdGoogle')
	.then(function(ofertas) {
		//			console.log(response);
		var quantidades = {};
		for (var i = 0; i < ofertas.length; i++) {
			if (!quantidades[ofertas[i]['usuIdGoogle']])
				quantidades[ofertas[i]['usuIdGoogle']] = 1;
			else
				quantidades[ofertas[i]['usuIdGoogle']]++;
		}
		var resposta = {
			ofertas, quantidades
		};
		console.log(resposta);
	})
	.catch(function(error) {
		console.error(JSON.stringify(error));
	});
