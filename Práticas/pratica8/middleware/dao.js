/**
 * Classes da biblioteca do MongoBD
 */
const Toddy = require('./database/models/Toddy');

module.exports = {

	inserir: async function (toddy) {
		let result = await Toddy.create(toddy);
		return result;
	},

	atualizar: async function (id, toddy) {
		let result = await Toddy.findByIdAndUpdate(id, toddy).lean(); // Buscando toddy por id e atualizando seus dados
		
		if (result != null) { // Caso o resultado não seja nulo, quer dizer que encontramos um registro para atulizar e ele foi atualizado
            let toddy = await Toddy.findById(id); // Buscamos o registro atualizado
            return toddy;
        } else {
            return result;
        }
	},

	listar: async function () {
		let toddyList = await Toddy.find();
		return toddyList;
	},

	buscarPorId: async function (id) {
		let toddyList = await Toddy.findById(id);
		return toddyList;
	},

	buscarVencidos: async function () {
		let toddyList = await Toddy.find(); // Buscamos todos

		var dataHoje = new Date(); // Variável para armazenar a data corrente
		var arrVencidos = []; // Array que vai armazenar os vencidos

		toddyList.forEach(// For each para cada resultado retornado pelo MongoDB, vamos selecionar apenas os vencidos
			function (toddyDbRes) {
				// Convertendo a string em data
				var parts = toddyDbRes.validade.split('/'); // Separando a data em um vetor DD MM AAAA
				// Atenção ao mês (parts[1]); JavaScript conta os meses a partir do 0:
				// Janeiro - 0, Fevereiro - 1, etc.
				var dataToddy = new Date(parts[2], parts[1] - 1, parts[0]);

				if (dataToddy < dataHoje) { // Se a data do produto for menor que a data de hoje, está vencido
					arrVencidos.push(toddyDbRes); // Adiciona elemento no vetor
				}
			}
		);

		return arrVencidos;
	},

	buscarLotes: async function () {
		let lotes = await Toddy.distinct('lote');
		return lotes;
	},

	buscarPorLote: async function (lote) {
		let toddyList = await Toddy.find({ lote });
		return toddyList;
	},

	excluir: async function (id) {
		let result = await Toddy.findByIdAndDelete(id);
		return result;
	}
}