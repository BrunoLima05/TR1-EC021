const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Toddy = new Schema(
    {
        lote: { type: String, default: null },
        conteudo: { type: Number, default: null },
        validade: { type: String, default: null }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Toddy', Toddy);