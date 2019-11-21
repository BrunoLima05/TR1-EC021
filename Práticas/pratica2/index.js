//Importando a biblioteca do Restify
var restify = require('restify');

/*
	Criando nossas funções do CRUD.
*/
function inserir(req, res, next) {
	/** Recebendo body da request */
	var lote = req.body.lote;
	var conteudo = req.body.conteudo;
	var validade = req.body.validade;

	/** Montando um objeto toddy */
	var toddy = {
		lote: lote,
		conteudo: conteudo,
		validade: validade
	}

	res.send(toddy);
	next();
}

function atualizar(req, res, next) {
	/** Recebendo body da request */
	var id = req.body.id;
	var lote = req.body.lote;
	var conteudo = req.body.conteudo;
	var validade = req.body.validade;
	
	/** Montando um objeto toddy */
	var toddy = {
		id: id,
		lote: lote,
		conteudo: conteudo,
		validade: validade
	}

	res.send(toddy);
	next();
}

function listar(req, res, next) {
	res.send('Callback do nosso listar');
	next();
}

function excluir(req, res, next) {
	var id = req.body.id;

	res.send('Você excluiu o ID: ' + id);
	next();
}

//Configurando servidor
var server = restify.createServer({	name: 'EC021 - Prática 2' });

/**
 * Utilizando o bodyParser para
 * converter o body da request em
 * um jSON
 * */
server.use(restify.plugins.bodyParser());

/*
	Definindo endpoints (ou rotas) da minha aplicação.
*/
var toddyPoint = '/toddy'; //Usaremos esta variável para padronizar as URI's

server.post(toddyPoint + '/salvar', inserir);
server.put(toddyPoint + '/salvar', atualizar);
server.get(toddyPoint + '/listar', listar);
server.del(toddyPoint + '/excluir', excluir);

//Definindo porta em que subiremos o servidor
var port = process.env.PORT || 5000;

//Subindo o servidor
server.listen(port, function() {
	console.log('%s rodando', server.name);
});