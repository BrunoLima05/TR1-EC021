const restify = require('restify');
const axios = require('axios');
const corsMiddleware = require("restify-cors-middleware");

//Configurando servidor
const server = restify.createServer({ name: 'EC021 - Prática 9' });

/**
 * Incluindo configuração do CORS
 */
const cors = corsMiddleware({
    origins: ["*"],
    allowHeaders: ["API-Token"],
    exposeHeaders: ["API-Token-Expiry"]
});

server.pre(cors.preflight);
server.use(restify.plugins.bodyParser()); //Utilizando o bodyParser para converter o body da request em um jSON
server.use(restify.plugins.queryParser()); //Utilizando o queryParser para permitir que métodos GET passem parâmetros na URL
server.use(cors.actual);

const apiPoint = '/api'; //Usaremos esta variável para padronizar as URI's
const toddyServer = 'http://localhost:5000/toddy'; //Endereço do nosso outro server

server.post(apiPoint + '/salvar', async (req, res) => {
    let url = `${toddyServer}/salvar`;
    let data = {
        lote: req.body.lote,
        conteudo: req.body.conteudo,
        validade: req.body.validade
    }
    let config = {
        headers: {},
    };

    axios.post(url, data, config)
        .then((response) => {
            return res.json(response.data);
        })
        .catch((error) => {
            return res.json(error.response.data);
        });
});

server.put(apiPoint + '/salvar/:id', async (req, res) => {
    let url = `${toddyServer}/salvar/${req.params.id}`;
    let data = {
        lote: req.body.lote,
        conteudo: req.body.conteudo,
        validade: req.body.validade
    }
    let config = {
        headers: {},
    };

    axios.patch(url, data, config)
        .then((response) => {
            return res.json(response.data);
        })
        .catch((error) => {
            return res.json(error.response.data);
        });
});

server.get(apiPoint + '/listar', async (req, res) => {
    let url = `${toddyServer}/listar`;
    let config = {
        headers: {},
        data: {}
    };

    axios.get(url, config)
        .then((response) => {
            return res.json(response.data);
        })
        .catch((error) => {
            return res.json(error.response.data);
        });
});

server.del(apiPoint + '/excluir', async (req, res) => {
    let url = `${toddyServer}/excluir`;
    let config = {
        headers: {},
        data: {
            id: req.body.id
        }
    };

    axios.delete(url, config)
        .then((response) => {
            return res.json(response.data);
        })
        .catch((error) => {
            return res.json(error.response.data);
        });
});

//Definindo porta em que subiremos o servidor
var port = process.env.PORT || 3000;

//Subindo o servidor
server.listen(port, function () {
    console.log('%s rodando', server.name);
});