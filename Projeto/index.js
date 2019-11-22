
/*-- Importando as bibliotecas utilizadas ----------------*/
const restify = require("restify");
const banco = require("/bancos");
const corsMiddleware = require("restify-cors-middleware");
const sleep = require('system-sleep');


/*-- configurações --------------------------------------*/



/*-- Funções --------------------------------------------*/


function login(req, res, next) {

  //Definindo o formato da response
  res.setHeader("content-type", "application/json");
  res.charSet("UTF-8");

  /** Recebendo ID como parâmetro na URL */
  var login = {
    username: req.body.username,
    password: req.body.password
  }

  /** Abrindo a conexão com o BD */
  var connection = mysql.createConnection(con);
  connection.connect();


  /** Escrevendo query que será executada */
  var strQuery = "SELECT username, logado, token FROM login;";

  //se login for tru tem acesso
  /** Exibindo query no console */
  console.log(strQuery);

  /** Executando query e processando resultados */
  connection.query(strQuery, function(err, rows, fields) {
    if (!err) {
      //Se não houver erros
      res.json(rows); //Retornamos as linhas
    } else {
      //Caso contrário
      res.json(err); //Retornamos dados sobre o erro
    }
  });

  /** Encerrando conexão com o BD */
  connection.end();

  /** Encerrando método da REST API */
  next();
}







/*  @ função para criação de meme 
    @ parametros : req, res
*/
function criar_meme(req, res, next) {
 
  //Definindo o formato da response
  res.setHeader("content-type", "application/json");
  res.charSet("UTF-8");

  // objeto meme com seus atributos
  var meme = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    ano: req.body.ano
  };

  banco.criar_meme(meme)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });

  /** Encerrando método da REST API */
  next();
}

function atualizar_meme(req, res, next) {
  //Definindo o formato da response
  res.setHeader("content-type", "application/json");
  res.charSet("UTF-8");

  /**
   * Montando um objeto toddy com
   * os dados que vieram do body da request
   */
  var meme = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    ano: req.body.ano
  };

   banco.criar_meme(meme)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });

  /** Encerrando método da REST API */
  next();
}

function buscar_meme(req, res, next) {

  //Definindo o formato da response
  res.setHeader("content-type", "application/json");
  res.charSet("UTF-8");

  /** Recebendo ID como parâmetro na URL */
  var id = req.query.id;

  banco.buscarPorId(id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });

  /** Encerrando método da REST API */
  next();
}


function excluir_meme(req, res, next) {
  //Definindo o formato da response
  res.setHeader("content-type", "application/json");
  res.charSet("UTF-8");

  var id = req.body.id;

  banco.excluir(id)
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
var server = restify.createServer({ name: "Prática Final" });

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

/*-- variaveis auxiliares -------------------------------*/
const project_uri = "/home"

/*-- Definição de Rotas da aplicação -------------------*/

server.post(project_uri + "/login", login);
server.post(project_uri + "/inserir", criar_meme);
server.post(project_uri + "/atualizar", atualizar_meme);
server.get(project_uri + "/buscarPorId", buscar_meme);
server.post(project_uri + "/excluir", excluir_meme);


//Definindo porta em que subiremos o servidor
var port = process.env.PORT || 5000;

//Subindo o servidor
server.listen(port, function() {
  console.log("%s rodando", server.name);
});

