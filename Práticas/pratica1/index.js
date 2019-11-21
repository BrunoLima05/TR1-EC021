//Importando a biblioteca do Restify
var restify = require('restify');

/*
	Criando nossas funções que serão chamadas pelos endpoints.
*/
function helloWorld(req, res, next) {
	//Definindo o formato da response
	res.setHeader('content-type', 'application/json');
	res.charSet('UTF-8');

	res.send("Hello world");
	next();
}

//Configurando servidor
var server = restify.createServer({	name: 'EC021 - Prática 1' });

/**
 * Utilizando o bodyParser para
 * converter o body da request em
 * um jSON
 * */
server.use(restify.plugins.bodyParser());

/*
	Definindo endpoints (ou rotas) da minha aplicação.
*/
server.get('/hello', helloWorld);

//Definindo porta em que subiremos o servidor
var port = process.env.PORT || 5000;

//Subindo o servidor
server.listen(port, function() {
	console.log('%s rodando', server.name);
});