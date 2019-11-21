//Importando a biblioteca do Restify
var restify = require('restify');
var mysql = require('mysql');

/*
	Criando objeto com as credenciais
	de conexão com o BD
*/
var con = {
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'ec021'
};

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

	/** Abrindo a conexão com o BD */
	var connection = mysql.createConnection(con);
	connection.connect();

	/** Escrevendo query que será executada */
	var strQuery = "INSERT INTO toddy (lote, conteudo, validade)" + 
					" VALUES ('"+ toddy.lote + "', " + toddy.conteudo +
					", '" + toddy.validade + "');";

	/** Exibindo query no console */
    console.log(strQuery);

	/** Executando query e processando resultados */
    connection.query(strQuery, function(err, rows, fields) {
        if (!err) { //Se não houver erros
            res.json(rows); //Retornamos as linhas
        } else { //Caso contrário
            res.json(err); //Retornamos dados sobre o erro
        }
    });

	/** Encerrando conexão com o BD */
	connection.end();

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

	/** Abrindo a conexão com o BD */
	var connection = mysql.createConnection(con);
	connection.connect();

	/** Escrevendo query que será executada */
	var strQuery = "UPDATE toddy SET lote = '" + toddy.lote +
				 "', conteudo = " + toddy.conteudo + 
				", validade = '" + toddy.validade + "'" +
				" WHERE id = " + toddy.id + ";";

	/** Exibindo query no console */
    console.log(strQuery);

	/** Executando query e processando resultados */
    connection.query(strQuery, function(err, rows, fields) {
        if (!err) { //Se não houver erros
            res.json(rows); //Retornamos as linhas
        } else { //Caso contrário
            res.json(err); //Retornamos dados sobre o erro
        }
    });

	/** Encerrando conexão com o BD */
	connection.end();

	/** Encerrando método da REST API */
	next();
}

function listar(req, res, next) {
	/** Abrindo a conexão com o BD */
	var connection = mysql.createConnection(con);
	connection.connect();

	/** Escrevendo query que será executada */
	var strQuery = "SELECT id, lote, conteudo, validade FROM toddy;";

	/** Exibindo query no console */
    console.log(strQuery);

	/** Executando query e processando resultados */
    connection.query(strQuery, function(err, rows, fields) {
        if (!err) { //Se não houver erros
            res.json(rows); //Retornamos as linhas
        } else { //Caso contrário
            res.json(err); //Retornamos dados sobre o erro
        }
    });

	/** Encerrando conexão com o BD */
	connection.end();

	/** Encerrando método da REST API */
	next();
}

function buscarPorId(req, res, next) {
	/** Recebendo ID como parâmetro na URL */
	var id = req.query.id;

	/** Abrindo a conexão com o BD */
	var connection = mysql.createConnection(con);
	connection.connect();

	/** Escrevendo query que será executada */
	var strQuery = "SELECT id, lote, conteudo, validade FROM toddy" + 
					" WHERE id = " + id + ";";

	/** Exibindo query no console */
    console.log(strQuery);

	/** Executando query e processando resultados */
    connection.query(strQuery, function(err, rows, fields) {
        if (!err) { //Se não houver erros
            res.json(rows); //Retornamos as linhas
        } else { //Caso contrário
            res.json(err); //Retornamos dados sobre o erro
        }
    });

	/** Encerrando conexão com o BD */
	connection.end();

	/** Encerrando método da REST API */
	next();
}

function buscarVencidos(req, res, next) {
	/** Abrindo a conexão com o BD */
	var connection = mysql.createConnection(con);
	connection.connect();

	/** Escrevendo query que será executada */
	var strQuery = "SELECT id, lote, conteudo, validade FROM toddy;";

	/** Exibindo query no console */
    console.log(strQuery);

	/** Executando query e processando resultados */
    connection.query(strQuery, function(err, rows, fields) {
        if (!err) { //Se não houver erros
			var dataHoje = new Date(); //Variável para armazenar a data corrente
			var vencidos = []; //Vetor para armazenar os vencidos

			for(var i = 0; i < rows.length; i++) {//Percorrendo todas as rows
				var toddy = rows[i];

				// Convertendo a string em data
				var parts = toddy.validade.split('/'); //Separando a data em um vetor DD MM AAAA
				// Atenção ao mês (parts[1]); JavaScript conta os meses a partir do 0:
				// Janeiro - 0, Fevereiro - 1, etc.
				var dataToddy = new Date(parts[2], parts[1]-1, parts[0]); 
				
				if(dataToddy < dataHoje) { //Se a data do produto for menor que a data de hoje, está vencido
					vencidos.push(toddy); //Adiciona elemento no vetor
				}
			}
			res.json(vencidos); //Retornamos as linhas com os produtos vencidos
        } else { //Caso contrário
            res.json(err); //Retornamos dados sobre o erro
        }
    });

	/** Encerrando conexão com o BD */
	connection.end();

	/** Encerrando método da REST API */
	next();
}

function excluir(req, res, next) {
	var id = req.body.id;

	/** Abrindo a conexão com o BD */
	var connection = mysql.createConnection(con);
	connection.connect();

	/** Escrevendo query que será executada */
	var strQuery = "DELETE FROM toddy WHERE id = " + id + ";";

	/** Exibindo query no console */
    console.log(strQuery);

	/** Executando query e processando resultados */
    connection.query(strQuery, function(err, rows, fields) {
        if (!err) { //Se não houver erros
            res.json(rows); //Retornamos as linhas
        } else { //Caso contrário
            res.json(err); //Retornamos dados sobre o erro
        }
    });

	/** Encerrando conexão com o BD */
	connection.end();

	/** Encerrando método da REST API */
	next();
}

//Configurando servidor
var server = restify.createServer({	name: 'EC021 - Prática 3' });

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