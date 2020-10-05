const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema ({
    title : [String]
})

const listSchema = new Schema({
    title : String,
    cards :  [cardSchema]
})

const boardSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: String,
        required: false
    },
    lists:{
        type:[listSchema],
    }
},{
    timestamps: true
});

var Boards = mongoose.model('Board', boardSchema);
module.exports = Boards;