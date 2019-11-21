//Importando a biblioteca do Restify
const restify = require('restify');
const dao = require('./dao');
const corsMiddleware = require("restify-cors-middleware");
const mongoose = require('mongoose');

/*
	Criando nossas funções do CRUD.
*/
async function inserir(req, res, next) {
	/* Recebendo os dados da requisição */
	let toddy = {
		lote: req.body.lote,
		conteudo: req.body.conteudo,
		validade: req.body.validade
	}

	let result = await dao.inserir(toddy);
	return res.json(result);
}

async function atualizar(req, res, next) {
	/** 
	 * Montando um objeto toddy com
	 * os dados que vieram do body da request
	*/
	let id = req.params.id; // Recebendo o valor do id da URL

	var toddy = {
		lote: req.body.lote,
		conteudo: req.body.conteudo,
		validade: req.body.validade
	}

	let result = await dao.atualizar(id, toddy);
	return res.json(result);
}

async function listar(req, res, next) {
	let toddyList = await dao.listar();
	return res.json(toddyList);
}

async function buscarPorId(req, res, next) {
	/** Recebendo ID como parâmetro na URL */
	var id = req.query.id;

	let toddyList = await dao.buscarPorId(id);
	return res.json(toddyList);
}

async function buscarVencidos(req, res, next) {
	let toddyList = await dao.buscarVencidos();
	return res.json(toddyList);
}

async function buscarLotes(req, res, next) {
	let lotes = await dao.buscarLotes();
	return res.json(lotes);
}

async function buscarPorLote(req, res, next) {
	/** Recebendo ID como parâmetro na URL */
	var lote = req.query.lote;

	let toddyList = await dao.buscarPorLote(lote);
	return res.json(toddyList);
}

async function excluir(req, res, next) {
	var id = req.body.id;

	let result = await dao.excluir(id);
	return res.json(result);
}

//Configurando servidor
var server = restify.createServer({ name: 'EC021 - Prática 8' });

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
server.put(toddyPoint + '/salvar/:id', atualizar);
server.get(toddyPoint + '/listar', listar);
server.get(toddyPoint + '/buscarPorId', buscarPorId);
server.get(toddyPoint + '/buscarVencidos', buscarVencidos);
server.get(toddyPoint + "/buscarLotes", buscarLotes);
server.get(toddyPoint + "/buscarPorLote", buscarPorLote);
server.del(toddyPoint + '/excluir', excluir);

//Definindo porta em que subiremos o servidor
var port = process.env.PORT || 5000;

const DB_URL = 'mongodb://localhost:27017';

const DB_SETTINGS = {
	useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
	user: '',
	pass: '',
	dbName: 'ec021'
}

//Subindo o servidor
server.listen(port, function () {
	console.log('%s rodando', server.name);

	mongoose.connect(DB_URL, DB_SETTINGS, (err) => {
		if (err) {
			console.log(`Erro na conexão com o MongoDB: ${DB_URL}`);
			console.log(`${err.message}`);
		}
		else {
			console.log(`Servidor conectado ao MongoDB: ${DB_URL}`);
		}
	});
});