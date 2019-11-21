/**
 * Classes da biblioteca do MongoBD
 */
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; //Usado para referências ao ID das entidades da coleção

const uri = 'mongodb://127.0.0.1:27017/'; //Endereço do nosso server
const params = { useNewUrlParser: true }; //Parâmetro necessário para versões mais novas do MongoDB
const dbName = 'ec021'; //Nome do nosso BD
const collName = 'toddy'; //Nome da coleção do nosso DB

module.exports = {

	inserir: function (toddy) {
		return new Promise(
			function (resolve, reject) {
				MongoClient.connect(uri, params, function (err, client) { //Abrindo a conexão com o MongoDB
					if (!err) {
						var db = client.db(dbName); //Selecionando o banco para conectar
						db.collection(collName).insertOne(toddy, function (err, dbRes) { //Executando operação de inserção
							if (!err) {
								console.log('Inserido ID=' + dbRes.insertedId);
								client.close();
								resolve(toddy);
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

	buscarVencidos: function () {
		return new Promise(function (resolve, reject) {
			MongoClient.connect(uri, params, function (err, client) { //Abrindo a conexão com o MongoDB
				if (!err) {
					var db = client.db(dbName); //Selecionando o banco para conectar

					db.collection(collName).find({}).toArray(function (err, dbRes) { //Executando busca no BD //Se o campo no BD fosse um Date poderíamos usar o filtro => { validade: {$lt: new Date()} }
						if (!err) {
							client.close();

							var dataHoje = new Date(); //Variável para armazenar a data corrente
							var arrVencidos = []; //Array que vai armazenar os vencidos

							dbRes.forEach(//For each para cada resultado retornado pelo MongoDB, vamos selecionar apenas os vencidos
								function (toddyDbRes) {
									// Convertendo a string em data
									var parts = toddyDbRes.validade.split('/'); //Separando a data em um vetor DD MM AAAA
									// Atenção ao mês (parts[1]); JavaScript conta os meses a partir do 0:
									// Janeiro - 0, Fevereiro - 1, etc.
									var dataToddy = new Date(parts[2], parts[1] - 1, parts[0]);

									if (dataToddy < dataHoje) { //Se a data do produto for menor que a data de hoje, está vencido
										arrVencidos.push(toddyDbRes); //Adiciona elemento no vetor
									}
								}
							)

							resolve(arrVencidos);
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

	buscarLotes: function () {
		return new Promise(function (resolve, reject) {
			MongoClient.connect(uri, params, function (err, client) { //Abrindo a conexão com o MongoDB
				if (!err) {
					var db = client.db(dbName); //Selecionando o banco para conectar
					db.collection(collName).distinct("lote", function (err, dbRes) { //Executando busca no BD
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

	buscarPorLote: function (lote) {
		return new Promise(function (resolve, reject) {
			MongoClient.connect(uri, params, function (err, client) { //Abrindo a conexão com o MongoDB
				if (!err) {
					var db = client.db(dbName); //Selecionando o banco para conectar

					db.collection(collName).find({ lote: lote }).toArray(function (err, dbRes) { //Executando busca no BD // .find({ lote: lote }) => Filtrando baseado no valor do lote passado
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