//Importando a biblioteca do Restify
var restify = require('restify');
var dao = require('./dao');

/*
	Criando nossas funções do CRUD.
*/
function inserir(req, res, next) {
	/** 
	 * Montando um objeto toddy com
	 * os dados que vieram do body da request
	*/
	var toddy = {
		lote: req.body.lote,
		conteudo: req.body.conteudo,
		validade: req.body.validade
	}

	var result = dao.inserir(toddy);

	res.json(result);

	/** Encerrando método da REST API */
	next();
}

function atualizar(req, res, next) {
	/** 
	 * Montando um objeto toddy com
	 * os dados que vieram do body da request
	*/
	var toddy = {
		id: req.body.id,
		lote: req.body.lote,
		conteudo: req.body.conteudo,
		validade: req.body.validade
	}

	var result = dao.atualizar(toddy);

	res.json(result);

	/** Encerrando método da REST API */
	next();
}

function listar(req, res, next) {
	var result = dao.listar();
	
	res.json(result);

	/** Encerrando método da REST API */
	next();
}

function buscarPorId(req, res, next) {
	/** Recebendo ID como parâmetro na URL */
	var id = req.query.id;

	var result = dao.buscarPorId(id);

	res.json(result);

	/** Encerrando método da REST API */
	next();
}

function buscarVencidos(req, res, next) {
	var result = dao.buscarVencidos();
	
	res.json(result);

	/** Encerrando método da REST API */
	next();
}

function excluir(req, res, next) {
	var id = req.body.id;

	var result = dao.excluir(id);
	
	res.json(result);

	/** Encerrando método da REST API */
	next();
}

//Configurando servidor
var server = restify.createServer({	name: 'EC021 - Prática 4' });

/**
 * Utilizando o bodyParser para
 * converter o body da request em
 * um jSON
 * */
server.use(restify.plugins.bodyParser());

/**
 * Utilizando o queryParser para
 * permitir que métodos GET passem
 * parâmetros na URL
*/
server.use(restify.plugins.queryParser());

/*
	Definindo endpoints (ou rotas) da minha aplicação.
*/
var toddyPoint = '/toddy'; //Usaremos esta variável para padronizar as URI's

server.post(toddyPoint + '/salvar', inserir);
server.put(toddyPoint + '/salvar', atualizar);
server.get(toddyPoint + '/listar', listar);
server.get(toddyPoint + '/buscarPorId', buscarPorId);
server.get(toddyPoint + '/buscarVencidos', buscarVencidos);
server.del(toddyPoint + '/excluir', excluir);

//Definindo porta em que subiremos o servidor
var port = process.env.PORT || 5000;

//Subindo o servidor
server.listen(port, function() {
	console.log('%s rodando', server.name);
});