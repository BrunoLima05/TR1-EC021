//Importando a biblioteca do Restify
const restify = require('restify');
const dao = require('./dao');
var corsMiddleware = require("restify-cors-middleware");

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

	dao.inserir(toddy)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});

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

	dao.atualizar(toddy)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});

	/** Encerrando método da REST API */
	next();
}

function listar(req, res, next) {
	dao.listar()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});

	/** Encerrando método da REST API */
	next();
}

function buscarPorId(req, res, next) {
	/** Recebendo ID como parâmetro na URL */
	var id = req.query.id;

	dao.buscarPorId(id)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});

	/** Encerrando método da REST API */
	next();
}

function buscarVencidos(req, res, next) {
	dao.buscarVencidos()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});

	/** Encerrando método da REST API */
	next();
}

function buscarLotes(req, res, next) {
	dao.buscarLotes()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});

	/** Encerrando método da REST API */
	next();
}

function buscarPorLote(req, res, next) {
	/** Recebendo ID como parâmetro na URL */
	var lote = req.query.lote;

	dao.buscarPorLote(lote)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});

	/** Encerrando método da REST API */
	next();
}

function excluir(req, res, next) {
	var id = req.body.id;

	dao.excluir(id)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});

	/** Encerrando método da REST API */
	next();
}

//Configurando servidor
var server = restify.createServer({ name: 'EC021 - Prática 7' });

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

/**
 * Incluindo configuração do CORS
 */
const cors = corsMiddleware({
	origins: ["*"],
	allowHeaders: ["API-Token"],
	exposeHeaders: ["API-Token-Expiry"]
});

server.pre(cors.preflight);
server.use(cors.actual);

/*
	Definindo endpoints (ou rotas) da minha aplicação.
*/
var toddyPoint = '/toddy'; //Usaremos esta variável para padronizar as URI's

server.post(toddyPoint + '/salvar', inserir);
server.put(toddyPoint + '/salvar', atualizar);
server.get(toddyPoint + '/listar', listar);
server.get(toddyPoint + '/buscarPorId', buscarPorId);
server.get(toddyPoint + '/buscarVencidos', buscarVencidos);
server.get(toddyPoint + "/buscarLotes", buscarLotes);
server.get(toddyPoint + "/buscarPorLote", buscarPorLote);
server.del(toddyPoint + '/excluir', excluir);

//Definindo porta em que subiremos o servidor
var port = process.env.PORT || 5000;

//Subindo o servidor
server.listen(port, function () {
	console.log('%s rodando', server.name);
});