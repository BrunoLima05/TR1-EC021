/**
 * Classes da biblioteca do MongoBD
 */
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; //Usado para referências ao ID das entidades da coleção

const uri = ' mongodb+srv://adauto:adauto@cluster0-rven8.mongodb.net/test?retryWrites=true&w=majority' //Endereço do nosso server
const params = { useNewUrlParser: true }; //Parâmetro necessário para versões mais novas do MongoDB
const dbName = 'ec021-av2-core'; //Nome do nosso BD
const collName = 'memes'; //Nome da coleção do nosso DB

module.exports = {

    inserir: function (meme) {
        return new Promise(
            function (resolve, reject) {
                MongoClient.connect(uri, params, function (err, client) { //Abrindo a conexão com o MongoDB
                    if (!err) {
                        var db = client.db(dbName); //Selecionando o banco para conectar
                        db.collection(collName).insertOne(memes, function (err, dbRes) { //Executando operação de inserção
                            if (!err) {
                                console.log('Inserido ID=' + dbRes.insertedId);
                                client.close();
                                resolve(memes);
                            } else {
                                reject(err); //Devolvemos um erro caso haja erro na inserção no BD
                            }
                        });
                    } else {
                        reject(err); //Devolvemos um erro caso haja erro na conexão com o MongoDB
                    }
                });
            }
        )
    },

    atualizar: function (toddy) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(uri, params, function (err, client) { //Abrindo a conexão com o MongoDB
                if (!err) {
                    var db = client.db(dbName); //Selecionando o banco para conectar

                    if (toddy.id) {
                        var _id = toddy.id;
                        var o_id = new ObjectId(_id); //Criando um objeto que fará referência ao ID
                        delete toddy.id; //Removendo ID para evitar duplicações do campo

                        db.collection(collName).replaceOne({ _id: o_id }, toddy, function (err, dbRes) { //Executando operação de replace (um tipo de update)
                            if (!err) {
                                console.log('Atualizado ID=' + _id);
                                client.close();
                                toddy.id = _id;
                                resolve(toddy);
                            } else {
                                reject(err); //Devolvemos um erro caso haja erro na atualização no BD
                            }
                        });
                    } else {
                        reject('Campo ID ausente');
                    }
                } else {
                    reject(err); //Devolvemos um erro caso haja erro na conexão com o MongoDB
                }
            });
        });
    },

    listar: function () {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(uri, params, function (err, client) { //Abrindo a conexão com o MongoDB
                if (!err) {
                    var db = client.db(dbName); //Selecionando o banco para conectar
                    db.collection(collName).find({}).project({}).toArray(function (err, dbRes) { //Executando busca no BD // .find({}) => filtro da busca // .project({}) => campos selecionados
                        if (!err) {
                            client.close();
                            resolve(dbRes);
                        } else {
                            reject(err); //Devolvemos um erro caso haja erro na busca no BD
                        }
                    });
                } else {
                    reject(err); //Devolvemos um erro caso haja erro na conexão com o MongoDB
                }
            });
        });
    },

    buscarPorId: function (id) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(uri, params, function (err, client) { //Abrindo a conexão com o MongoDB
                if (!err) {
                    var db = client.db(dbName); //Selecionando o banco para conectar

                    var o_id = new ObjectId(id); //Criando um objeto que fará referência ao ID

                    db.collection(collName).find({ _id: o_id }).toArray(function (err, dbRes) { //Executando busca no BD // { _id: o_id } => filtro da busca
                        if (!err) {
                            client.close();
                            resolve(dbRes);
                        } else {
                            reject(err); //Devolvemos um erro caso haja erro na busca no BD
                        }
                    });
                } else {
                    reject(err); //Devolvemos um erro caso haja erro na conexão com o MongoDB
                }
            });
        });
    },
    
    excluir: function (id) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(uri, params, function (err, client) { //Abrindo a conexão com o MongoDB
                if (!err) {
                    var db = client.db(dbName); //Selecionando o banco para conectar

                    if (id) {
                        var o_id = new ObjectId(id); //Criando um objeto que fará referência ao ID

                        db.collection(collName).deleteOne({ _id: o_id }, function (err, dbRes) { //Executando exclusão no BD
                            if (err) {
                                console.log('Removido ID=' + id);
                                client.close();
                                resolve(dbRes);
                            } else {
                                reject(err); //Devolvemos um erro caso haja erro na exclusão no BD
                            }
                        });
                    }
                } else {
                    reject(err); //Devolvemos um erro caso haja erro na conexão com o MongoDB
                }
            });
        });
    }
}