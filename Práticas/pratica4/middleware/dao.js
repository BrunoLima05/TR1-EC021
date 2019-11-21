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
}

module.exports = {

    inserir: function (toddy) {
        /** Abrindo a conexão com o BD */
        var connection = mysql.createConnection(con);
        connection.connect();

        /** Escrevendo query que será executada */
        var strQuery = "INSERT INTO toddy (lote, conteudo, validade)" +
            " VALUES ('" + toddy.lote + "', " + toddy.conteudo +
            ", '" + toddy.validade + "');";

        /** Exibindo query no console */
        console.log(strQuery);

        /** Executando query e processando resultados */
        var result = null;
        connection.query(strQuery, function (err, rows, fields) {
            if (!err) { //Se não houver erros
                result = rows; //Retornamos as linhas
            } else { //Caso contrário
                result = err; //Retornamos dados sobre o erro
            }
        });

        /** Encerrando conexão com o BD */
        connection.end();

        return result;
    },

    atualizar: function (toddy) {
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
        var result = null;
        connection.query(strQuery, function (err, rows, fields) {
            if (!err) { //Se não houver erros
                result = rows; //Retornamos as linhas
            } else { //Caso contrário
                result = err; //Retornamos dados sobre o erro
            }
        });

        /** Encerrando conexão com o BD */
        connection.end();

        return result;
    },

    listar: function () {
        /** Abrindo a conexão com o BD */
        var connection = mysql.createConnection(con);
        connection.connect();

        /** Escrevendo query que será executada */
        var strQuery = "SELECT id, lote, conteudo, validade FROM toddy;";

        /** Exibindo query no console */
        console.log(strQuery);

        /** Executando query e processando resultados */
        var result = null;
        connection.query(strQuery, function (err, rows, fields) {
            if (!err) { //Se não houver erros
                result = rows; //Retornamos as linhas
            } else { //Caso contrário
                result = err; //Retornamos dados sobre o erro
            }
        });

        /** Encerrando conexão com o BD */
        connection.end();

        return result;
    },

    buscarPorId: function (id) {
        /** Abrindo a conexão com o BD */
        var connection = mysql.createConnection(con);
        connection.connect();

        /** Escrevendo query que será executada */
        var strQuery = "SELECT id, lote, conteudo, validade FROM toddy" +
            " WHERE id = " + id + ";";

        /** Exibindo query no console */
        console.log(strQuery);

        /** Executando query e processando resultados */
        var result = null;
        connection.query(strQuery, function (err, rows, fields) {
            if (!err) { //Se não houver erros
                result = rows; //Retornamos as linhas
            } else { //Caso contrário
                result = err; //Retornamos dados sobre o erro
            }
        });

        /** Encerrando conexão com o BD */
        connection.end();

        return result;
    },

    buscarVencidos: function () {
        /** Abrindo a conexão com o BD */
        var connection = mysql.createConnection(con);
        connection.connect();

        /** Escrevendo query que será executada */
        var strQuery = "SELECT id, lote, conteudo, validade FROM toddy;";

        /** Exibindo query no console */
        console.log(strQuery);

        /** Executando query e processando resultados */
        var result = null;
        connection.query(strQuery, function (err, rows, fields) {
            if (!err) { //Se não houver erros
                var dataHoje = new Date(); //Variável para armazenar a data corrente
                var vencidos = []; //Vetor para armazenar os vencidos

                for (var i = 0; i < rows.length; i++) {//Percorrendo todas as rows
                    var toddy = rows[i];

                    // Convertendo a string em data
                    var parts = toddy.validade.split('/'); //Separando a data em um vetor DD MM AAAA
                    // Atenção ao mês (parts[1]); JavaScript conta os meses a partir do 0:
                    // Janeiro - 0, Fevereiro - 1, etc.
                    var dataToddy = new Date(parts[2], parts[1] - 1, parts[0]);

                    if (dataToddy < dataHoje) { //Se a data do produto for menor que a data de hoje, está vencido
                        vencidos.push(toddy); //Adiciona elemento no vetor
                    }
                }
                result = vencidos; //Retornamos as linhas com os produtos vencidos
            } else { //Caso contrário
                result = err; //Retornamos dados sobre o erro
            }
        });

        /** Encerrando conexão com o BD */
        connection.end();

        return result;
    },

    excluir: function (id) {
        /** Abrindo a conexão com o BD */
        var connection = mysql.createConnection(con);
        connection.connect();

        /** Escrevendo query que será executada */
        var strQuery = "DELETE FROM toddy WHERE id = " + id + ";";

        /** Exibindo query no console */
        console.log(strQuery);

        /** Executando query e processando resultados */
        var result = null;
        connection.query(strQuery, function (err, rows, fields) {
            if (!err) { //Se não houver erros
                result = rows; //Retornamos as linhas
            } else { //Caso contrário
                result = err; //Retornamos dados sobre o erro
            }
        });

        /** Encerrando conexão com o BD */
        connection.end();

        return result;
    },

}